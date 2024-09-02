const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createProduct);
router.get('/', getProducts);

module.exports = router;

