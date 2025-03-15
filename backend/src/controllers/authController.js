import { genSalt, hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const validatePassword = (password) => {
  const minLength = 6;
  if (password.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters`);
  }
};

const authResponse = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      balance: user.balance
    }
  };
};


const register = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    validatePassword(password);

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'user',
      balance: 1000
    });

    await newUser.save();
    res.status(201).json(authResponse(newUser));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(authResponse(user));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export { register, login };