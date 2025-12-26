import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { maskPhone } from '../utils/maskPhone.js';

function buildListingQuery(query) {
  const filter = {};
  const { priceType, condition, allowSwap, status, q } = query;

  if (priceType === 'sale' || priceType === 'free') filter.priceType = priceType;
  if (condition) filter.condition = condition;
  if (allowSwap === 'true') filter.allowSwap = true;
  if (allowSwap === 'false') filter.allowSwap = false;
  if (status === 'available' || status === 'sold') filter.status = status;

  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  return filter;
}

export async function getListings(req, res, next) {
  try {
    const filter = buildListingQuery(req.query);
    let sort = { createdAt: -1 };

    if (req.query.sort === 'priceAsc') sort = { price: 1 };
    if (req.query.sort === 'priceDesc') sort = { price: -1 };

    const listings = await Listing.find(filter).sort(sort);
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

export async function getListingById(req, res, next) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).lean();
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const owner = await User.findById(listing.ownerId).select('name phone showPhoneTo');
    const currentUserId = req.user?._id?.toString();

    let phoneMasked = '';
    let phoneFull = '';

    if (owner?.phone) {
      const canSeeFull =
        owner.showPhoneTo === 'public' ||
        (owner.showPhoneTo === 'logged_in' && !!currentUserId);

      if (canSeeFull) {
        phoneFull = owner.phone;
        phoneMasked = maskPhone(owner.phone);
      } else {
        phoneMasked = maskPhone(owner.phone);
      }
    }

    res.json({
      ...listing,
      owner: {
        id: owner?._id,
        name: owner?.name || 'Unknown',
        phoneMasked,
        phoneFull: phoneFull || null
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function createListing(req, res, next) {
  try {
    const { title, condition, description, price, priceType, images, allowSwap, swapNotes } =
      req.body;

    if (!title || !condition || !description) {
      return res
        .status(400)
        .json({ message: 'Title, condition, description are required' });
    }

    let finalPriceType = priceType === 'free' ? 'free' : 'sale';
    let finalPrice = finalPriceType === 'free' ? 0 : Number(price ?? 0);

    if (finalPriceType === 'sale' && (isNaN(finalPrice) || finalPrice < 0)) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    const listing = await Listing.create({
      title,
      condition,
      description,
      price: finalPrice,
      priceType: finalPriceType,
      images: Array.isArray(images) ? images.slice(0, 5) : [],
      ownerId: req.user._id,
      allowSwap: !!allowSwap,
      swapNotes
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

export async function updateListing(req, res, next) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const allowed = { ...req.body };

    if (allowed.priceType === 'free') {
      allowed.price = 0;
    }

    const updated = await Listing.findByIdAndUpdate(id, allowed, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await listing.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function updateListingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['available', 'sold'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    listing.status = status;
    await listing.save();
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function createSwapOffer(req, res, next) {
  try {
    const { id } = req.params;
    const { offeredDescription } = req.body;

    if (!offeredDescription || !offeredDescription.trim()) {
      return res.status(400).json({ message: 'Offer description is required' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!listing.allowSwap) {
      return res.status(400).json({ message: 'Swap not allowed for this listing' });
    }

    const text = offeredDescription.trim();
    listing.swapNotes = listing.swapNotes
      ? `${listing.swapNotes}\n\nOffer from ${req.user.name || 'User'}: ${text}`
      : `Offer from ${req.user.name || 'User'}: ${text}`;

    await listing.save();

    return res.status(201).json({ success: true, message: 'Swap offer saved' });
  } catch (err) {
    next(err);
  }
}
