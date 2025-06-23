import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name required'],
    minlength: [2, 'Full Name must contain at least 2 characters'],
    trim: true, // ✅ This trims leading/trailing whitespace before validation
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone Number required'],
    unique:true
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
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
  },
  image: {
    type: String, // image file name or URL
    default: 'https://i.ibb.co/2kR5zq0/default-avatar.png', // default empty
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
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  friendRequestsSent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  friendRequestsReceived: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],

  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],

  sharedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }]

});


// Hash password before saving
userSchema.pre('save', async function (next) {
  // Assign companyId if new and doesn't already have it
  if (this.isNew && !this.companyId) {
    const now = new Date();

    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const yyyy = now.getFullYear();

    const dateStr = `${dd}${mm}${yyyy}`;

    // 2. Count users created on the same day
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const countToday = await mongoose.model('User').countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // 3. Generate companyId like `lz23062025001`
    this.companyId = `lz${dateStr}00${countToday + 1}`;
  }

  // Hash password if it's modified
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateJsonWebToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};

// Generate Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //--15 minutes
  return resetToken;
};

export const userModel = mongoose.model('User', userSchema);
