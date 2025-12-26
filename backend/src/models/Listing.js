import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 80 },
    condition: {
      type: String,
      enum: ['new', 'like_new', 'good', 'fair'],
      required: true
    },
    description: { type: String, required: true, maxlength: 200 },
    price: { type: Number, default: 0, min: 0 },
    priceType: {
      type: String,
      enum: ['sale', 'free'],
      default: 'sale'
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Maximum 5 images allowed'
      },
      default: []
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available'
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    allowSwap: { type: Boolean, default: false },
    swapNotes: { type: String }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const Listing = mongoose.model('Listing', listingSchema);
