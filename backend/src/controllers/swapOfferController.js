import { SwapOffer } from '../models/SwapOffer.js';
import { Listing } from '../models/Listing.js';

export async function createSwapOffer(req, res, next) {
  try {
    const { listingId } = req.params;
    const { offeredDescription } = req.body;

    if (!offeredDescription || !offeredDescription.trim()) {
      return res.status(400).json({ message: 'offeredDescription is required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.allowSwap) {
      return res.status(400).json({ message: 'Listing does not accept swap offers' });
    }

    const offer = await SwapOffer.create({
      listingId,
      fromUserId: req.user._id,
      toUserId: listing.ownerId,
      offeredDescription: offeredDescription.trim()
    });

    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
}

export async function getSwapOffersForUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    if (!req.user || req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const filter = {};
    if (role === 'received') filter.toUserId = userId;
    else if (role === 'sent') filter.fromUserId = userId;
    else return res.status(400).json({ message: 'role must be received|sent' });

    const offers = await SwapOffer.find(filter).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    next(err);
  }
}

export async function updateSwapOfferStatus(req, res, next) {
  try {
    const { offerId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'withdrawn'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const offer = await SwapOffer.findById(offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    const userId = req.user._id.toString();

    if (status === 'withdrawn' && offer.fromUserId.toString() !== userId) {
      return res.status(403).json({ message: 'Only sender can withdraw' });
    }
    if (['accepted', 'rejected'].includes(status) && offer.toUserId.toString() !== userId) {
      return res.status(403).json({ message: 'Only recipient can accept/reject' });
    }

    offer.status = status;
    if (status === 'accepted') {
      offer.acceptedAt = new Date();
    }
    await offer.save();

    res.json(offer);
  } catch (err) {
    next(err);
  }
}
