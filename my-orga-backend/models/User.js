const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String,enum: ['user', 'admin'],  default: 'user' }, // Add role field
  createdAt: { type: Date, default: Date.now }, // Track when the user was created
});

module.exports = mongoose.model('User', UserSchema);

