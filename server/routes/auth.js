const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60)
      return res.status(400).json({ message: 'Name must be between 2 and 60 characters' });

    if (!EMAIL_RE.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    if (password.length > 128)
      return res.status(400).json({ message: 'Password is too long' });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(409).json({ message: 'An account with that email already exists' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hash });

    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    if (!EMAIL_RE.test(email))
      return res.status(400).json({ message: 'Invalid email or password' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('Auth/me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
