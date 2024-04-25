const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};