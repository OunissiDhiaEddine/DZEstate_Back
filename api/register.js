const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cors = require('micro-cors');
const cors = Cors();
const { parse } = require('micro-json');
const connectDb = require('../connectDb');

module.exports = cors(async (req, res) => {
  await connectDb();
  const body = await parse(req);
  const { username, email, password } = body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  user = new User({
    username,
    email,
    password,
  });

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});