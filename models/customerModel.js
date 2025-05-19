const { pool } = require('../config/db');

module.exports = {
  findAll: async () => {
    return await pool.query('SELECT * FROM customers WHERE deleted_at IS NULL');
  },

  findById: async (id) => {
    return await pool.query(
      'SELECT * FROM customers WHERE id = ? AND deleted_at IS NULL', 
      [id]
    );
  },

  create: async (customer) => {
    return await pool.query(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [customer.name, customer.email, customer.phone, customer.address]
    );
  },

  update: async (id, customer) => {
    return await pool.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ? AND deleted_at IS NULL',
      [customer.name, customer.email, customer.phone, customer.address, id]
    );
  },

  softDelete: async (id) => {
    return await pool.query(
      'UPDATE customers SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  },

  getCustomerTransactions: async (customerId) => {
    return await pool.query(`
      SELECT t.id, t.total_amount, t.status, t.created_at,
             ti.quantity, ti.price,
             p.id as product_id, p.name as product_name
      FROM transactions t
      JOIN transaction_items ti ON t.id = ti.transaction_id
      JOIN products p ON ti.product_id = p.id
      WHERE t.customer_id = ?
    `, [customerId]);
  }
};