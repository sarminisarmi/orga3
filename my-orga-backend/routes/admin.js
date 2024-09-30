// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/authenticateJWT'); // Import authenticateToken

// // Define the isAdmin function, which checks if the user is an admin
// function isAdmin(req, res, next) {
//     if (req.user && req.user.role === 'admin') {
//         next(); // If the user is an admin, proceed to the next middleware
//     } else {
//         res.status(403).send('Access denied.'); // If not an admin, respond with 403 Forbidden
//     }
// }

// // Route to update user role via PUT, token and admin checks applied
// router.put('/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
//     const userId = req.params.id;
//     const newRole = req.body.role;
    
//     try {
//         // Find the user by ID and update their role
//         const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
//         if (!user) return res.status(404).send('User not found.');
        
//         res.send(user); // Return the updated user information
//     } catch (err) {
//         res.status(500).send('An error occurred.');
//     }
// });

// module.exports = router;
