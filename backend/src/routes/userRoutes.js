import { Router } from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:id', getUser);
router.patch('/:id', requireAuth, updateUser);

export default router;
