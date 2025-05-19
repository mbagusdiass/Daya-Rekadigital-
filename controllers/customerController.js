const customerModel = require('../models/customerModel');
const { validateCustomer } = require('../middlewares/validation');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const [customers] = await customerModel.findAll();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const [customer] = await customerModel.findById(req.params.id);
    if (customer.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const [transactions] = await customerModel.getCustomerTransactions(req.params.id);
    
    res.json({
      ...customer[0],
      transactions
    });
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = [
  validateCustomer,
  async (req, res, next) => {
    try {
      const { name, email, phone, address } = req.body;
      const [result] = await customerModel.create({ name, email, phone, address });
      res.status(201).json({ id: result.insertId, name, email, phone, address });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateCustomer = [
  validateCustomer,
  async (req, res, next) => {
    try {
      const { name, email, phone, address } = req.body;
      const [result] = await customerModel.update(req.params.id, { name, email, phone, address });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json({ message: 'Customer updated successfully' });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteCustomer = async (req, res, next) => {
  try {
    const [result] = await customerModel.softDelete(req.params.id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};