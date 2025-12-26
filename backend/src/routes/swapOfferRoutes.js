import { Router } from 'express';
import {
  createSwapOffer,
  getSwapOffersForUser,
  updateSwapOfferStatus
} from '../controllers/swapOfferController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/listings/:listingId/swap-offers', requireAuth, createSwapOffer);
router.get('/swap-offers/user/:userId', requireAuth, getSwapOffersForUser);
router.patch('/swap-offers/:offerId', requireAuth, updateSwapOfferStatus);

export default router;
