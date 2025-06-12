import crypto from 'crypto';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { generateToken } from '../utils/jwtToken.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';// Import the uploadToCloudinary function 
import { sendEmail } from '../utils/sendEmail.js';
import { userModel } from '../models/user.model.js';
import firebaseadmin from '../config/firebaseAdmin.js';
import UserAbout from '../models/user.about.js';
import {Post} from '../models/user.post.js';
import {Story} from '../models/user.story.js';
import fs from 'fs-extra';

import mongoose from "mongoose";

// Register User with Image Upload
export const registerUser = catchAsyncErrors(async (req, res, next) => {

  const { fullName, email, phone, password, role  } = req.body;
  console.log('req.body:', req.body);
  // Add this line
  
 
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('Email already exists', 400));
  }
  
  // image upload to cloudinary
  try {
    

    const userRole = role || 'user';
    // Create new user
    const createdUser = await userModel.create({
      fullName,
      email,
      phone,
      password,
      role:userRole,
      
    });

    // If user creation fails
    if (!createdUser) {
      return next(new ErrorHandler('User creation failed', 400));
    }

    // Generate JWT token and send response
    generateToken(createdUser, 'User Registered Successfully', 201, res);

  } catch (err) {
    console.error('Registration error:', err); // Log the error for debugging
    res.status(500).json({ error: err.message }); //
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

// Login with Facebook
export const loginWithFacebook = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await firebaseadmin.auth().verifyIdToken(idToken);
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

// Login with Google
export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token required' });
    }

    // Verify Firebase ID token
    const decodedToken = await firebaseadmin.auth().verifyIdToken(idToken);
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

// Logout User
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

// updateMe
export const updateMe = async (req, res) => {
  try {
    const updates = { fullName: req.body.name };

    console.log("🟡 Received name:", req.body.name);
    console.log("🟡 Received file:", req.file?.originalname);
    const filePath=req.file.path;

    if (req.file) {
      const photoURL = await uploadToCloudinary(filePath, req.user.id);
      updates.image = photoURL;
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    await fs.remove(filePath);
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

    // Fetch full user info including relationships
    const user = await userModel.findById(userId)
      .select('fullName email image friends friendRequestsSent friendRequestsReceived phone role');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user about info
    let about = await UserAbout.findOne({ userId });

    if (!about) {
      about = {
        bio: '',
        location: '',
        website: '',
        // other default fields can go here
      };
    }

    // Fetch user's posts with populated likes, comments, and shares
    const posts = await Post.find({ user: userId })
      .populate('user', 'fullName email image')
      .populate('likes', 'fullName image')
      .populate({
        path: 'comments.user',
        select: 'fullName image',
      })
      .populate('shares.user', 'fullName image')
      .sort({ createdAt: -1 });

    // Compose the full profile response
    const profileData = {
      id: userId,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      photoURL: user.image,
      about,
      posts,
      friends: user.friends,
      friendRequestsSent: user.friendRequestsSent,
      friendRequestsReceived: user.friendRequestsReceived,
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
    const filePath=req.file.path;

    if (req.file) {
      // Assume you upload file to Cloudinary and get secure_url & type here
      const result = await uploadToCloudinary(filePath,{resource_type: 'auto',});
      mediaUrl = result;
      
      mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }
    await fs.remove(filePath);
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





export const uploadStory = async (req, res) => {
  try {
    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
       
    }
    console.log("Uploading story for user:", req.user); // Make sure _id is there
    console.log("File received:", req.file?.path);
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, {
      resource_type: "image",
    });

    // If upload failed
    

    // Create story
    const story = await Story.create({
      user: req.user._id,
      image: result,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hr
      views: [],
    });
    console.log("✅ Story saved in DB:", story); 

    // Delete local file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    res.status(201).json(story);
  } catch (err) {
    console.error("Upload story error:", err.message || err);
    res.status(500).json({ message: "Failed to upload story", error: err.message });
  }
};


// Get all recent stories
export const getStories = async (req, res) => {
  try {
    // Fetch all non-expired stories grouped by user
    const stories = await Story.aggregate([
      { $match: { expiresAt: { $gt: new Date() } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$user",
          story: { $first: "$$ROOT" }, // get most recent story per user
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$story._id",
          user: "$user",
          image: "$story.image",
          createdAt: "$story.createdAt",
          expiresAt: "$story.expiresAt",
          storyCount: "$count"
        }
      }
    ]);
    res.json(stories);
  } catch (err) {
    console.error("Error fetching stories for slider:", err);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};

export const recordStoryView = async (req, res) => {
  const storyId = req.params.storyId;
  const viewerId = req.user._id;

  try {
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Check if user already viewed this story
    const alreadyViewed = story.views.some(v => v.user.toString() === viewerId.toString());
    if (!alreadyViewed) {
      story.views.push({ user: viewerId, viewedAt: new Date() });
      await story.save();
    }

    res.json({ message: "View recorded" });
  } catch (err) {
    console.error("Error recording story view:", err);
    res.status(500).json({ message: "Failed to record story view" });
  }
};




//friends




// Send Friend Request
export const sendFriendRequest = async (req, res) => {
  const { targetId } = req.params;
  const currentUser = await userModel.findById(req.user.id);
  const targetUser = await userModel.findById(targetId);

  if (!currentUser || !targetUser) return res.status(404).json({ msg: 'User not found' });
  if (currentUser.friends.includes(targetId)) return res.status(400).json({ msg: 'Already friends' });

  if (!currentUser.friendRequestsSent.includes(targetId)) {
    currentUser.friendRequestsSent.push(targetId);
    targetUser.friendRequestsReceived.push(req.user.id);
    await currentUser.save();
    await targetUser.save();
  }

  res.json({ msg: 'Friend request sent' });
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  const { targetId } = req.params;
  const currentUser = await userModel.findById(req.user.id);
  const targetUser = await userModel.findById(targetId);

  if (!currentUser.friendRequestsReceived.includes(targetId)) {
    return res.status(400).json({ msg: 'No friend request from this user' });
  }

  currentUser.friends.push(targetId);
  targetUser.friends.push(req.user.id);

  currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(id => id.toString() !== targetId);
  targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(id => id.toString() !== req.user.id);

  await currentUser.save();
  await targetUser.save();

  res.json({ msg: 'Friend request accepted' });
};

// Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
  const { targetId } = req.params;
  const currentUser = await userModel.findById(req.user.id);
  const targetUser = await userModel.findById(targetId);

  currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(id => id.toString() !== targetId);
  targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(id => id.toString() !== req.user.id);

  await currentUser.save();
  await targetUser.save();

  res.json({ msg: 'Friend request rejected' });
};

// Unfriend
export const unfriendUser = async (req, res) => {
  const { targetId } = req.params;
  const currentUser = await userModel.findById(req.user.id);
  const targetUser = await userModel.findById(targetId);

  currentUser.friends = currentUser.friends.filter(id => id.toString() !== targetId);
  targetUser.friends = targetUser.friends.filter(id => id.toString() !== req.user.id);

  await currentUser.save();
  await targetUser.save();

  res.json({ msg: 'Unfriended successfully' });
};

// Get Friends List
export const getFriendsList = async (req, res) => {
  const user = await userModel.findById(req.user.id).populate('friends', 'fullName email image');
  res.json(user.friends);
};

// Get Pending Requests (sent & received)
export const getPendingRequests = async (req, res) => {
  const user = await userModel.findById(req.user.id)
    .populate('friendRequestsReceived', 'fullName email image')
    .populate('friendRequestsSent', 'fullName email image');

  res.json({
    received: user.friendRequestsReceived,
    sent: user.friendRequestsSent,
  });
};

// Search Users and include relationship status
export const searchUsers = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  const { q } = req.query;

  const users = await userModel.find({
    fullName: { $regex: q, $options: 'i' },
    _id: { $ne: req.user.id },
  }).select('fullName email image');

  const enhanced = users.map(u => {
    let status = 'none';
    if (user.friends.includes(u._id)) status = 'friends';
    else if (user.friendRequestsSent.includes(u._id)) status = 'sent';
    else if (user.friendRequestsReceived.includes(u._id)) status = 'incoming';

    return {
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      image: u.image,
      status,
    };
  });

  res.json(enhanced);
};



export const storyView = async (req, res) => {
  const storyId = req.params.storyId;
  const viewerId = req.user._id;

  try {
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Check if user already viewed this story
    const alreadyViewed = story.views.some(v => v.user.toString() === viewerId.toString());
    if (!alreadyViewed) {
      story.views.push({ user: viewerId, viewedAt: new Date() });
      await story.save();
    }

    res.json({ message: "View recorded" });
  } catch (err) {
    console.error("Error recording story view:", err);
    res.status(500).json({ message: "Failed to record story view" });
  }
};
export const getUserStories = async (req, res) => {
  const { userId } = req.params;

  try {
    const stories = await Story.find({ user: userId }).sort({ createdAt: -1 });

    if (!stories || stories.length === 0) {
      return res.status(404).json({ message: 'No stories found for this user.' });
    }

    res.status(200).json(stories);
  } catch (err) {
    console.error('Error fetching user stories:', err);
    res.status(500).json({ message: 'Failed to fetch user stories.' });
  }
};



export const getStoryViews = async (req, res) => {
  const { storyId } = req.params;

  try {
    const stories = await Story.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "fullName image")
    .populate("views.user", "fullName image email");

  res.status(200).json(stories);
  } catch (err) {
    console.error("Error fetching story viewers:", err);
    res.status(500).json({ message: "Failed to fetch viewers" });
  }
};
