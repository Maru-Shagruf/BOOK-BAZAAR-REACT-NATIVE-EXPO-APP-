import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: true
      // WARNING: stored as plain text for prototype only; always hash in production.
      // TODO: replace with bcrypt hash before going live.
    },
    phone: { type: String },
    phoneVerified: { type: Boolean, default: false },
    showPhoneTo: {
      type: String,
      enum: ['public', 'logged_in', 'hidden'],
      default: 'logged_in'
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const User = mongoose.model('User', userSchema);
