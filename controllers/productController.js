const productModel = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
  try {
    const [products] = await productModel.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;
    const [result] = await productModel.create({ name, description, price, stock });
    res.status(201).json({ id: result.insertId, name, description, price, stock });
  } catch (error) {
    next(error);
  }
};