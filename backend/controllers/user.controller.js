import crypto from 'crypto';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { userModel } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { generateToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import admin from '../config/firebaseAdmin.js';

// Register User with Image Upload
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, phone, password, role  } = req.body;
  console.log('req.body:', req.body);
  console.log('req.file:', req.file); // Add this line
  
  if (!req.file) {
    return next(new ErrorHandler('Image is required', 400));
  }

  let imageUrl = '';

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('Email already exists', 400));
  }
  
  try {
    imageUrl = await uploadToCloudinary(req.file.path);
    if (!imageUrl) {
      return next(new ErrorHandler('Failed to upload image', 400));
    }


    const userRole = role || 'user';
    const createdUser = await userModel.create({
      fullName,
      email,
      phone,
      password,
      role:userRole,
      image: imageUrl,
    });

    if (!createdUser) {
      return next(new ErrorHandler('User creation failed', 400));
    }

    generateToken(createdUser, 'User Registered Successfully', 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});





// Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body); 

  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  generateToken(user, 'User Logged In Successfully', 200, res);
});



export const loginWithFacebook = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { name, email, picture, uid } = decodedToken;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        fullName: name,
        email,
        password: email + process.env.JWT_SECRET, // dummy password
        image: picture,
        phone: '0000000000',
        role: 'user',
      });
    }

    const token = user.generateJsonWebToken();

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Facebook login error:', error.message);
    res.status(401).json({ success: false, message: 'Facebook login failed' });
  }
};
export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token required' });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: 'Email not found in token' });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      const dummyPassword = uid + crypto.randomBytes(5).toString('hex');

      user = await userModel.create({
        fullName: name || 'Google User',
        email,
        phone: '0000000000', // default value
        password: dummyPassword,
        image: picture || '',
        role: 'user',
      });
    }

    const token = user.generateJsonWebToken();

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
};

//Logout User
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .json({
      success: true,
      message: 'User Logged Out Successfully!',
    });
});

// Get My Profile
export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  res.status(200).json({ success: true, user });
});

// Get All Users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({ success: true, users });
});

// Admin Dashboard
export const getAdminDashboard = catchAsyncErrors(async (req, res, next) => {
  const totalUsers = await userModel.countDocuments();
  res.status(200).json({
    success: true,
    message: 'Admin Dashboard Data',
    data: { totalUsers },
  });
});

// SuperAdmin Dashboard
export const getSuperAdminDashboard = catchAsyncErrors(
  async (req, res, next) => {
    const totalUsers = await userModel.countDocuments();
    res.status(200).json({
      success: true,
      message: 'SuperAdmin Dashboard Data',
      data: { totalUsers },
    });
  },
);

// Update User Profile (with optional image)
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const updateData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
  };

  if (req.body.image) {
    const uploaded = await cloudinary.uploader.upload(req.body.image, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    updateData.image = uploaded.secure_url;
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: 'User Updated Successfully!',
    user: updatedUser,
  });
});

// Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler('Please provide all fields', 400));
  }

  const user = await userModel.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(currentPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid current password', 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler('New password and confirm password do not match', 400),
    );
  }

  user.password = newPassword; //--
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password Updated Successfully!',
  });
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not Found', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your password reset link is: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Recovery',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Reset email sent to ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler('Email could not be sent', 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  //--
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (password !== confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  generateToken(user, 'Reset Password Successfully!', 200, res); //--
});
