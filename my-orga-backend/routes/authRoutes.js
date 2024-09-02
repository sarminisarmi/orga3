const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this is the correct path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register route
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
  
    try {
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
      }
  
      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'User', // Assign role if provided, otherwise default to 'User'
      });
  
      await newUser.save();
      res.status(201).json({ message: 'Successfully registered' });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
});
  

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and the user's role
    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error('Login Error:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
          