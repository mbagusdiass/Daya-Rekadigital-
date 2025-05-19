const { pool } = require('../../config/db');
const fs = require('fs').promises;
const path = require('path');

class Seeder {
  constructor() {
    this.data = {};
  }

  async loadSeedFiles() {
    try {
      this.data.products = await this.loadJson('products.json');
      this.data.customers = await this.loadJson('customers.json');
      this.data.transactions = await this.loadJson('transactions.json');
    } catch (error) {
      throw new Error(`Failed to load seed files: ${error.message}`);
    }
  }

  async loadJson(filename) {
    const filePath = path.join(__dirname, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }

  async clearTables() {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE transaction_items');
    await pool.query('TRUNCATE TABLE transactions');
    await pool.query('TRUNCATE TABLE products');
    await pool.query('TRUNCATE TABLE customers');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  async seedProducts() {
    for (const product of this.data.products) {
      await pool.query(
        'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
        [product.name, product.description, product.price, product.stock]
      );
    }
    console.log(`Seeded ${this.data.products.length} products`);
  }

  async seedCustomers() {
    for (const customer of this.data.customers) {
      await pool.query(
        'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
        [customer.name, customer.email, customer.phone, customer.address]
      );
    }
    console.log(`Seeded ${this.data.customers.length} customers`);
  }

  async seedTransactions() {
    const [customers] = await pool.query('SELECT id FROM customers LIMIT 3');
    const [products] = await pool.query('SELECT id, price FROM products LIMIT 5');

    for (let i = 0; i < this.data.transactions.length; i++) {
      const tx = this.data.transactions[i];
      const customerId = customers[i]?.id || customers[0].id;
      
      // Calculate total amount
      let totalAmount = 0;
      const items = tx.items.map((item, idx) => {
        const product = products[idx % products.length];
        totalAmount += product.price * item.quantity;
        return {
          ...item,
          product_id: product.id,
          price: product.price
        };
      });

      // Insert transaction
      const [txResult] = await pool.query(
        'INSERT INTO transactions (customer_id, total_amount) VALUES (?, ?)',
        [customerId, totalAmount]
      );

      // Insert items
      for (const item of items) {
        await pool.query(
          'INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [txResult.insertId, item.product_id, item.quantity, item.price]
        );

        // Update product stock
        await pool.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }
    console.log(`Seeded ${this.data.transactions.length} transactions`);
  }

  async run() {
    try {
      await pool.query('START TRANSACTION');
      await this.loadSeedFiles();
      await this.clearTables();
      
      console.log('Seeding started...');
      await this.seedProducts();
      await this.seedCustomers();
      await this.seedTransactions();
      
      await pool.query('COMMIT');
      console.log('Database seeding completed successfully!');
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Seeding failed:', error.message);
      throw error;
    } finally {
      await pool.end();
    }
  }
}

if (require.main === module) {
  new Seeder().run().catch(() => process.exit(1));
}

module.exports = Seeder;