import crypto from 'crypto';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { userModel } from '../models/user.model.js';
import { generateToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import admin from '../config/firebaseAdmin.js';
import UserAbout from '../models/user.about.js';
import {Post} from '../models/user.post.js';
import {Story} from '../models/user.story.js';
import fs from "fs";
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Register User with Image Upload
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, phone, password,role  } = req.body;
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
        phone: '0000000000',
        password: dummyPassword,
        image: picture || '',
        role: 'user',
      });
    }

    const token = user.generateJsonWebToken();

    // ✅ Set cookie so backend middleware can read it
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      token, // still useful for frontend state, like Redux or localStorage
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
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .json({
      success: true,
      message: 'User Logged Out Successfully!',
    });
});


//updateMe
export const updateMe = async (req, res) => {
  try {
    const updates = { fullName: req.body.name };

    console.log("🟡 Received name:", req.body.name);
    console.log("🟡 Received file:", req.file?.originalname);

    if (req.file) {
      const photoURL = await uploadToCloudinary(req.file.path, req.user.id);
      updates.image = photoURL;
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    console.log("✅ User updated:", updatedUser.fullName, updatedUser.image);

    res.status(200).json({
      status: 'success',
      user: updatedUser,
    });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get My Profile
export const getMyProfile = catchAsyncErrors(async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user basic info
    const user = await userModel.findById(userId).select('fullName email image');

    // Fetch user about info
    let about = await UserAbout.findOne({ userId });

    if (!about) {
      about = {
        bio: '',
        location: '',
        website: '',
        // add other default about fields if needed
      };
    }

    // Fetch posts by user with likes, comments, shares populated
    const posts = await Post.find({ user: userId })
      .populate('user', 'fullName email image')      // Post owner info
      .populate('likes', 'fullName image')           // Users who liked
      .populate({
        path: 'comments.user',
        select: 'fullName image',
      })
      .populate('shares.user', 'fullName image')
      .sort({ createdAt: -1 });

    // Compose full profile response
    const profileData = {
      id: userId,
      name: user?.fullName || 'User Name',
      email: user?.email || '',
      photoURL: user?.image || '',
      about,
      posts,
    };

    res.status(200).json({ success: true, profile: profileData });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

export const getPosts= catchAsyncErrors( async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'fullName image');
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load posts' });
  }
});
//post by user
// export const createPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     let mediaUrl = null;
//     let mediaType = null;

//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.path);
//       mediaUrl = result;
//       mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
//     }

//     const newPost = await Post.create({
//       text,
//       mediaUrl,
//       mediaType,
//       user: req.user.id, // from auth middleware
//     });

//     res.status(201).json({
//       message: 'Post created',
//       post: newPost,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create post' });
//   }
// };


//post bu user
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      // Assume you upload file to Cloudinary and get secure_url & type here
      const result = await uploadToCloudinary(req.file.path,{resource_type: 'auto',});
      mediaUrl = result;
      
      mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    const post = new Post({
      user: req.user._id,
      text,
      mediaUrl,
      mediaType,
    });

    await post.save();

    // Optionally update user posts array
    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id },
    });

    res.status(201).json({
      success: true,
      message: 'Post created',
      post,
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//likes of post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // If already liked, remove like (toggle)
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ success: true, likesCount: post.likes.length });
  } catch (error) {
    console.error('Like Post Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//comment bu user
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// share by user
export const sharePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.shares.includes(userId)) {
      post.shares.push(userId);
      post.shareCount += 1;
      await post.save();
    }

    res.status(200).json({ success: true, shareCount: post.shareCount });
  } catch (error) {
    console.error('Share Post Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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

  // Handle base64 image upload (optional)
  if (req.body.image && req.body.image.startsWith('data:image')) {
    const uploaded = await cloudinary.uploader.upload(req.body.image, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });
    updateData.image = uploaded.secure_url;
  }
  console.log(req.body);
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
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
   console.log(user);
  if (!user) {
    return next(new ErrorHandler('User not Found', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset link is: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`;

  try {
    console.log("Sending email with link:", message);
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
  console.log(password);

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




// Upload story
export const uploadStory = async (req, res) => {
  try {
    // Validate that multer uploaded a file
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    console.log("Received file:", req.file);

    // Upload file to Cloudinary
    const result = await uploadToCloudinary(req.file.path, {
      
      resource_type: "auto", // supports image/video
    });

    console.log("Cloudinary result:", result);

    // Save to MongoDB
    const story = await Story.create({
      user: req.user._id,
      image: result,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    console.log("Saved story:", story);

    // Delete file from temp folder
    fs.unlink(req.file.path, () => {});

    res.status(201).json(story);
  } catch (err) {
    console.error("Upload story error:", err);
    res.status(500).json({ message: "Failed to upload story" });
  }
};

// Get all recent stories
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate("user", "fullName image") // include user name and profile image
      .sort({ createdAt: -1 });
     console.log(stories)
    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};