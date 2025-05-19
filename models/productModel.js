const { pool } = require('../config/db');

module.exports = {
  findAll: async () => {
    return await pool.query('SELECT * FROM products');
  },

  findById: async (id) => {
    return await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  },

  create: async (product) => {
    return await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [product.name, product.description, product.price, product.stock]
    );
  },

  updateStock: async (id, quantity) => {
    return await pool.query(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, id]
    );
  }
};