import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Counter } from './Counter.js';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name required'],
    minlength: [2, 'Full Name must contain at least 2 characters'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone Number required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must contain at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
  },
  image: {
    type: String,
    default: 'https://i.ibb.co/2kR5zq0/default-avatar.png',
  },
  companyId: {
    type: String,
    unique: true,
    sparse: true,
  },
  
  resetPasswordToken: {
    type: String,
    select: false,
  },

  resetPasswordExpire: {
    type: Date,
    select: false,
  },

  productListed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  sharedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew && !this.companyId) {
      const counter = await Counter.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );

      const paddedCount = String(counter.count).padStart(4, '0'); // 0001, 0002...

      // Include today's date just as part of ID (not affecting counter)
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const datePart = `${yyyy}${mm}${dd}`;

      this.companyId = `lc${datePart}${paddedCount}`; // e.g., lc202506290001
    }

    // Hash password if modified
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export const userModel = mongoose.model('User', userSchema);
