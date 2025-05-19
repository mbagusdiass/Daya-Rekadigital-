const { pool } = require('../config/db');

module.exports = {
  create: async (transaction) => {
    return await pool.query(
      'INSERT INTO transactions (customer_id, total_amount) VALUES (?, ?)',
      [transaction.customer_id, transaction.total_amount]
    );
  },

  createItem: async (transactionId, item) => {
    return await pool.query(
      'INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [transactionId, item.product_id, item.quantity, item.price]
    );
  }
};