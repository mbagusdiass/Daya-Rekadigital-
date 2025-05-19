const express = require('express');
const router = express.Router();
const customerRoutes = require('./customerRoutes');
const productRoutes = require('./productRoutes');
const transactionRoutes = require('./transactionRoutes');

router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;