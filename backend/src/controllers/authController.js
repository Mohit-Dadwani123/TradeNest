const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password, phone } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });
    
    // Create empty portfolio for user
    await Portfolio.create({
      user: user._id,
      holdings: []
    });
    
    // Create empty watchlist for user
    await Watchlist.create({
      user: user._id,
      stocks: []
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      balance: updatedUser.balance,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword
};