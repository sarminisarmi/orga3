 
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authenticateJWT'); 
// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user is an admin
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // If the user is admin, proceed
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};




module.exports = { authenticateToken, isAdmin };
