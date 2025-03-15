import { genSalt, hash, compare } from 'bcryptjs';
import pkg from 'jsonwebtoken';
import User from '../models/User.js';

const register = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    user = new User({ username, password: hashedPassword, role, balance: 1000 });
    await user.save();

    const token = pkg.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token });
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
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export { register, login };