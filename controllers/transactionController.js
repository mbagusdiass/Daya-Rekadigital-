const { pool } = require('../config/db');
const productModel = require('../models/productModel');
const transactionModel = require('../models/transactionModel');
const { validateTransaction } = require('../middlewares/validation');

exports.createTransaction = [
  validateTransaction,
  async (req, res, next) => {
    const { customer_id, items } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const [customer] = await connection.query(
        'SELECT id FROM customers WHERE id = ? AND deleted_at IS NULL', 
        [customer_id]
      );
      if (customer.length === 0) {
        throw new Error('Customer not found');
      }

      let totalAmount = 0;
      for (const item of items) {
        const [product] = await connection.query(
          'SELECT price, stock FROM products WHERE id = ?', 
          [item.product_id]
        );
        
        if (product.length === 0) {
          throw new Error(`Product ${item.product_id} not found`);
        }
        
        if (product[0].stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.product_id}`);
        }
        
        totalAmount += product[0].price * item.quantity;
      }

      const [transactionResult] = await connection.query(
        'INSERT INTO transactions (customer_id, total_amount) VALUES (?, ?)',
        [customer_id, totalAmount]
      );
      const transactionId = transactionResult.insertId;

      for (const item of items) {
        const [product] = await connection.query(
          'SELECT price FROM products WHERE id = ?', 
          [item.product_id]
        );
        
        await connection.query(
          'INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [transactionId, item.product_id, item.quantity, product[0].price]
        );
        
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();
      
      res.status(201).json({ 
        message: 'Transaction created successfully',
        transaction_id: transactionId
      });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }
];