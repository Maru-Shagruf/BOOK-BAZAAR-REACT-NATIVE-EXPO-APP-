import { User } from '../models/User.js';

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password, // plain text for prototype only
      name: name || ''
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name || '',
      phone: user.phone || '',
      showPhoneTo: user.showPhoneTo
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name || '',
      phone: user.phone || '',
      showPhoneTo: user.showPhoneTo
    });
  } catch (err) {
    next(err);
  }
}
