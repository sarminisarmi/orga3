

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Example route definitions
router.post('/add', productController.addProduct); // Ensure addProduct is a function
router.get('/list', productController.getProducts); // Ensure getProducts is a function

module.exports = router;
