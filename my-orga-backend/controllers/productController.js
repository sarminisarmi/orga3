const Product = require('../models/Product');


console.log('Product Controller Loaded');

// Define and export functions
exports.addProduct = (req, res) => {
  console.log('Add Product Function Called');
  res.send('Product added');
};

exports.getProducts = (req, res) => {
  console.log('Get Products Function Called');
  res.send('List of products');
};
