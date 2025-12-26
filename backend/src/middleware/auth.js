import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const userId = req.header('x-user-id');
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const user = await User.findById(userId).select('_id name email phone showPhoneTo');
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
