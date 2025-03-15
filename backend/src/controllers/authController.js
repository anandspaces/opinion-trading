import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User, { findOne } from '../models/User';
import { error as _error } from '../utils/logger';

const register = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    
    let user = await findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    user = new User({ username, password: hashedPassword, role, balance: 1000 });
    await user.save();

    const token = sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token });
  } catch (error) {
    _error(error.message);
    res.status(500).send('Server Error');
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findOne({ username });
    
    if (!user || !(await compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    _error(error.message);
    res.status(500).send('Server Error');
  }
};

export { register, login };