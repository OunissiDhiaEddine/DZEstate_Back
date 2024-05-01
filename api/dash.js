// api for the dash , it gets user data with GET /api/dash and updates user data with PUT /api/dash/update

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// GET /
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    const dbUser = await User.findById(user.id).populate('properties');

    if (!dbUser) return res.status(404).json({ message: 'User not found' });
    res.json(dbUser);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.sendStatus(403);
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// PUT /
router.put('/update', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    const dbUser = await User.findById(user.id);

    if (!dbUser) return res.status(404).json({ message: 'User not found' });
    Object.assign(dbUser, req.body);
    await dbUser.save();
    res.json(dbUser);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.sendStatus(403);
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

module.exports = router;