const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    let property = new Property({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      owner: user.id,
    });

    await property.save();

    // Update the user
    const userToUpdate = await User.findById(user.id);
    if (userToUpdate) {
      if (!userToUpdate.properties) {
        userToUpdate.properties = [];
      }
      userToUpdate.properties.push(property._id);
      await userToUpdate.save();
    }

    res.json(property);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;