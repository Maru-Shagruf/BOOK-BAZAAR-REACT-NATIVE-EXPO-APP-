import { User } from '../models/User.js';

export async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!req.user || req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const { name, phone, showPhoneTo } = req.body;
    const allowed = {};
    if (name !== undefined) allowed.name = name;
    if (phone !== undefined) allowed.phone = phone;
    if (showPhoneTo !== undefined) allowed.showPhoneTo = showPhoneTo;

    const updated = await User.findByIdAndUpdate(id, allowed, { new: true }).select(
      'name email phone showPhoneTo'
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
