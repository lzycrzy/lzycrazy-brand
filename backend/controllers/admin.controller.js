import crypto from 'crypto';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { adminModel } from '../models/admin.model.js';
import { generateTokenAdmin } from '../utils/jwtToken.admin.js';
import { sendEmail } from '../utils/sendEmail.js';
import cloudinary from 'cloudinary';

// REGISTER ADMIN
export const registerAdmin = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;

  const adminExists = await adminModel.findOne({ email });
  if (adminExists) {
    return next(new ErrorHandler('Admin already exists', 400));
  }

  let image = '';
  if (req.file) {
    image = req.file.filename;
  }

  const newAdmin = await adminModel.create({
    fullName,
    email,
    phone,
    password,
    role,
    image,
  });

  generateTokenAdmin(newAdmin, "Admin registered successfully", 201, res);
});


export const loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // Find admin by email and select password explicitly
  const admin = await adminModel.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Compare entered password with hashed password in DB
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Generate token and send response
  generateTokenAdmin(admin, "Admin logged in successfully", 200, res);
});


// LOGOUT ADMIN
export const logoutAdmin = (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};


// GET ADMIN PROFILE
export const getAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel.findById(req.admin._id);
  res.status(200).json({ success: true, admin });
});

// UPDATE PROFILE
export const updateAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel.findById(req.admin._id);
  if (!admin) return next(new ErrorHandler('Admin not found', 404));

  const { fullName, email, phone } = req.body;

  admin.fullName = fullName || admin.fullName;
  admin.email = email || admin.email;
  admin.phone = phone || admin.phone;

  await admin.save();
  res.status(200).json({ success: true, message: 'Profile updated' });
});

// UPDATE PASSWORD
export const updateAdminPassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const admin = await adminModel.findById(req.admin._id).select('+password');
  const isMatch = await admin.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler('Old password is incorrect', 400));

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// FORGOT PASSWORD
export const forgotAdminPassword = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel.findOne({ email: req.body.email });
  if (!admin) return next(new ErrorHandler('Admin not found', 404));

  const resetToken = admin.getResetPasswordToken();
  await admin.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/admin/password/reset/${resetToken}`;

  const message = `Reset your password using the following link: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: admin.email,
      subject: 'Admin Password Reset',
      message,
    });

    res.status(200).json({ success: true, message: `Email sent to ${admin.email}` });
  } catch (error) {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save({ validateBeforeSave: false });

    return next(new ErrorHandler('Failed to send email', 500));
  }
});

// RESET PASSWORD
export const resetAdminPassword = catchAsyncErrors(async (req, res, next) => {
  const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const admin = await adminModel.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!admin) return next(new ErrorHandler('Token is invalid or expired', 400));

  admin.password = req.body.password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  generateTokenAdmin(admin, 200, res);
});

// GET ADMIN DASHBOARD DATA
export const getAdminDashboard = catchAsyncErrors(async (req, res, next) => {
  // Static response or connect with analytics logic
  res.status(200).json({ success: true, message: 'Admin dashboard data' });
});

// GET ALL USERS LIST
export const getAllUsersList = catchAsyncErrors(async (req, res, next) => {
  const users = await adminModel.find({ role: 'user' }); // depends on your model
  res.status(200).json({ success: true, users });
});

// DELETE SINGLE USER
export const deleteSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await adminModel.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 404));

  await user.remove();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});
