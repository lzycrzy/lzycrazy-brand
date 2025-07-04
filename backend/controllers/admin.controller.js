import crypto from 'crypto';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { adminModel } from '../models/admin.model.js';
import { userModel } from '../models/user.model.js';
import { generateTokenAdmin } from '../utils/jwtToken.admin.js';
import { sendEmail } from '../utils/sendEmail.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';
import Applicant from '../models/Applicant.js';
import Hiring from '../models/hiring.model.js';

// REGISTER ADMIN
export const registerAdmin = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;

  const adminExists = await adminModel.findOne({ email });
  if (adminExists) {
    return next(new ErrorHandler('Admin already exists', 400));
  }

  const newAdmin = await adminModel.create({
    fullName,
    email,
    phone,
    password,
    role,
  });

  generateTokenAdmin(newAdmin, "Admin registered successfully", 201, res);
});

// Login ADMIN
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

  // Update basic fields
  admin.fullName = fullName || admin.fullName;
  admin.email = email || admin.email;
  admin.phone = phone || admin.phone;

  // Handle image upload with your cloudinary utility
  if (req.file) {
    try {
      console.log('Uploading image to Cloudinary...');
      console.log('File path:', req.file.path);
      // Delete old image if exists
      if (admin.image && admin.image !== '') {
        console.log('Deleting old image...');
        await deleteFromCloudinary(admin.image);
      }

      // Upload to Cloudinary using your utility function
      const imageUrl = await uploadToCloudinary(req.file.path, 'admin_profiles');

      // Set new image URL
      admin.image = imageUrl;

      console.log('Image uploaded successfully:', imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      return next(new ErrorHandler('Image upload failed', 500));
    }
  }

  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    admin: {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      image: admin.image,
      role: admin.role
    }
  });
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
  if (!admin) return next(new ErrorHandler('Email not found', 404));

  const resetToken = admin.getResetPasswordToken();
  await admin.save({ validateBeforeSave: false });

  const resetURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  console.log(resetURL);
  // const message = `Reset your password using the following link: \n\n ${resetURL}`;
  const message = `
      Hi ${admin.fullName || 'Admin'},\n\n
      You (or someone else) requested a password reset for your admin account.\n
      Please click on the following link to reset your password:\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email.\n
      Thank you.
    `;

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
  console.log(req.body.password)
  admin.password = req.body.password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  generateTokenAdmin(admin, "Password reset successful", 200, res);

});

// GET ADMIN DASHBOARD DATA WITH STATISTICS
export const getAdminDashboard = catchAsyncErrors(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const totalUsers = await userModel.countDocuments();
    const totalAdmins = await adminModel.countDocuments({ role: 'admin' });

    // Active users 
    const activeUsers = await userModel.countDocuments({
      isActive: true
    });

    // Recent registrations
    const todayRegistrations = await userModel.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    const weeklyRegistrations = await userModel.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    const monthlyRegistrations = await userModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // User status breakdown
    const usersByStatus = await userModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent users (last 10)
    const recentUsers = await userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('fullName email createdAt status');

    // Monthly user growth
    const monthlyGrowth = await userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const dashboardData = {
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: {
        overview: {
          totalUsers,
          totalAdmins,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers
        },
        registrations: {
          today: todayRegistrations,
          thisWeek: weeklyRegistrations,
          thisMonth: monthlyRegistrations
        },
        userStats: {
          byStatus: usersByStatus,
          recentUsers,
          monthlyGrowth
        },
        systemInfo: {
          serverTime: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      }
    };

    res.status(200).json(dashboardData);

  } catch (error) {
    return next(new ErrorHandler('Error fetching dashboard data', 500));
  }
});

// GET ALL USERS LIST WITH PAGINATION AND FILTERS
export const getAllUsersList = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10, search, status, sortBy = 'createdAt' } = req.query;
  const skip = (page - 1) * limit;
  let query = {};
  if (search) {
    query = {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };
  }
  if (status) {
    query.status = status;
  }
  // Get users with pagination
  const users = await userModel
    .find(query)
    .sort({ [sortBy]: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-password');
  const totalUsers = await userModel.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// DELETE SINGLE USER
export const deleteSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 404));

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// Get all Hiring forms
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Hiring.find().sort({ createdAt: -1 }); // newest first
    
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Deleted single hiring form 
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete
    const deleted = await Applicant.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Request Admin Password Reset
export const requestAdminPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Send email logic
    await sendResetEmail(email, token, 'admin');

    res.status(200).json({ message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};

// Step 2: Reset Password
// export const resetAdminPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const admin = await Admin.findById(decoded.id);
//     if (!admin) return res.status(404).json({ message: 'Admin not found' });

//     const hashed = await bcrypt.hash(password, 12);
//     admin.password = hashed;
//     await admin.save();

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid or expired token', error: err.message });
//   }
// };