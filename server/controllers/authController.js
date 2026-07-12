const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signupSchema, loginSchema } = require('../validations/authValidation');

const signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }

  user = new User({ name, email, password, role });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
  res.status(201).json({ token });
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 400;
    throw err;
  }

  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
  
  const userInfo = { ...user._doc };
  delete userInfo.password;
  
  res.json({ token, user: userInfo });
};

module.exports = { signup, login };
