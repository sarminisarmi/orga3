const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
  const { user, products, totalPrice } = req.body;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  // Validate products
  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'No products in order' });
  }

  try {
    // Create new order
    const newOrder = new Order({ user, products, totalPrice });
    await newOrder.save();
    return res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Error placing order' });
  }
});

// Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' });
  }
});

module.exports = router;
