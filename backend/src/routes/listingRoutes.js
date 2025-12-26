import { Router } from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  updateListingStatus,
  createSwapOffer
} from '../controllers/listingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getListings);
router.get('/:id', requireAuth, getListingById);
router.post('/', requireAuth, createListing);
router.patch('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);
router.patch('/:id/status', requireAuth, updateListingStatus);
router.post('/:id/swap-offers', requireAuth, createSwapOffer);

export default router;
