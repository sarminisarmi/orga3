const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




// Define and export functions
exports.addProduct = (req, res) => {
  console.log('Add Product Function Called');
  res.send('Product added');
};

exports.getProducts = (req, res) => {
  console.log('Get Products Function Called');
  res.send('List of products');
};
