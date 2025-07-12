import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name required'],
    minlength: [4, 'Full Name must contain at least 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
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
    select: false, //--for getting user password
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin'],
    default: 'admin',
  },
  image: {
    type: String, // image file name or URL
    default: '', // default empty
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpire: {
    type: Date,
    select: false,
  },
  lastLoginToken: {
    type: String,
    select: false,  // security ke liye by default hide
  },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
adminSchema.methods.generateJsonWebToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};

// Generate Reset Password Token
adminSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //--15 minutes
  return resetToken;
};



export const adminModel = mongoose.model('Admin', adminSchema);
