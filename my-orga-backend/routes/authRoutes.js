const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateJWT');
const User = require('../models/User'); // Ensure this is the correct path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register route
router.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }

        // Password strength check (optional)
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'User', // Default to 'User' if no role is provided
        });

        await newUser.save();
        res.status(201).json({ message: 'Successfully registered' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users route
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const users = await User.find(); // Find all users in the database

        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json(users); // Return the list of users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// POST new user (for admin dashboard)
router.post('/users', authenticateToken, isAdmin, async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'User', // Default to 'User' if no role is provided
        });

        await newUser.save();
        res.status(201).json({ message: 'User successfully created' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change user role route
router.put('/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
    const { role } = req.body;
    const userId = req.params.id;

    // Check if the new role is valid
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    try {
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        userToUpdate.role = role; // Update role
        await userToUpdate.save();
        res.status(200).json({ message: 'User role updated successfully', role: userToUpdate.role });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware for admin role check
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); // If the user is admin, allow them to proceed
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}

module.exports = router;
