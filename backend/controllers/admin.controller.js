import crypto from 'crypto';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { adminModel } from '../models/admin.model.js';
import { userModel } from '../models/user.model.js';
import { generateTokenAdmin } from '../utils/jwtToken.admin.js';
import { sendEmail } from '../utils/sendEmail.js';
import { deleteFromCloudinary, generateVideoThumbnail, uploadToCloudinary } from '../utils/cloudinary.js';
import Applicant from '../models/Applicant.js';
import Hiring from '../models/hiring.model.js';
import adminMarketPost from '../models/adminMarketPost.js'
import getVideoThumbnailUrl from '../middlewares/getVideoThumbnailUrl.js'
import bannerModel from '../models/banner.model.js';
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


// GET MARKET POST FOR ADMIN
export const getMarketPost = async(req, res) => {
  try {
    const posts = await bannerModel.find();

    if (!posts) {
      return res.status(404).json({
        success: false,
        message: "Post not foundd"
      })
    }

    return res.status(200).json({
      success: true,
      data: posts
    })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server error",
        error: error.message
      })
  }
}


// CREATE MARKET POST
export const createMarketPost = async (req, res) => {
  try {
    const { name, type, url, date, position } = req.body;
    const file = req.file;

    // Validation
    if (!name || !type || !date || !file || !position) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Upload to Cloudinary using the helper
    const uploadedUrl = await uploadToCloudinary(file.path, 'market-posts');

    // Construct the new document
    const newPost = new bannerModel({
      name: name.trim(),
      type,
      position: position,
      url: url.trim(),
      postUrl: uploadedUrl,
      thumbnail: type === 'image' ? uploadedUrl : '', // optional logic
      postDate: new Date(date),
    });

    await newPost.save();

    res.status(201).json({
      message: 'Market post created successfully',
      data: newPost,
    });

  } catch (err) {
    console.error('Error creating market post:', err);
    res.status(500).json({ error: 'Server error while uploading post.' });
  }
};

// UPDATE MARKET POST

export const updateMarketPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, url, date } = req.body;
    const file = req.file;
    console.log("Req file", req.file);

    const existingPost = await bannerModel.findById(id);
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });

    // Optional file replacement
    let newFileUrl = existingPost.postUrl;

    if (file) {
      // Upload new file
      const uploadResult = await uploadToCloudinary(file.path, 'market-posts');
      newFileUrl = uploadResult;
      console.log(newFileUrl);
    }

    existingPost.name = name;
    existingPost.type = type;
    existingPost.url = url;
    existingPost.postUrl = newFileUrl;
    existingPost.postDate = new Date(date);

    await existingPost.save();

    res.json({ message: 'Post updated', data: existingPost });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Server error while updating post' });
  }
};

// DELETE MARKET POST
export const deleteMarketPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await bannerModel.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await bannerModel.findByIdAndDelete(id);

    const remainingPost = await bannerModel.find();
    res.json({ success: true, message: 'Post deleted successfully', data: remainingPost });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, error: 'Server error while deleting post' });
  }
};

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
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // send only over HTTPS in production
    sameSite: 'Lax', // or 'None' if using cross-site cookies
    path: '/',       // clear from entire domain
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

// UPDATE ADMIN PASSWORD
export const updateAdminPassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler('Both current and new passwords are required.', 400));
  }

  const admin = await adminModel.findById(req.admin._id).select('+password');
  if (!admin) {
    return next(new ErrorHandler('Admin not found', 404));
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorHandler('Current password is incorrect', 400));
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
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

// Get all Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Hiring.find().sort({ createdAt: -1 }); // newest first
    
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Get One Applications
export const getOneApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Hiring.findById(id);
    
    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete
    const deleted = await Hiring.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Application Status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate allowed statuses
    const allowedStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedApp = await Hiring.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return the updated document
    );

    if (!updatedApp) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      application: updatedApp
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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

// ADMIN MARKET POST
export const marketPost=async(req,res)=>{
    try {
        const post=await adminMarketPost.find({})
       return res.status(200).json({
          message:post
        })
    } catch (error) {
         return res.status(401).json({
          message:"Something went wrong!"
        })
    }
}
export const publishPost=async(req,res)=>{
  console.log("hello")
    try {
        console.log(req.file,req.body);
        const{userName,url,postDate}=req.body
        const filePath=req.file?.path
        if(req.file){
                const postUrl = await uploadToCloudinary(filePath);
               const type = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
               if(type=="video"){
                 const thumnail=getVideoThumbnailUrl(postUrl)
                  const post=new adminMarketPost({userName,postUrl,url,thumnail,type,postDate}) 
                  await post.save()
                    return res.status(200).json({
                   message:"Posted Successfully"
                      })
               }else{
                   const post=new adminMarketPost({userName,postUrl,url,type,postDate}) 
                  await post.save()
                    return res.status(200).json({
                   message:"Posted Successfully"
                        })
               }
        }else{
          return res.status(401).json({
          message:"Please select at least one image/video !"
        }) 
        }
    } catch (error){
           return res.status(401).json({
          message:"Something wrong !"
        })
    }
}
export const updatePost=async(req,res)=>{
    try {
         const{_id}=req.params
        const{url,postDate,prevPostUrl}=req.body
        const filePath=req.file?.path
        const type = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
        if(req.file){
                const postUrl = await uploadToCloudinary(filePath);
                await deleteFromCloudinary(prevPostUrl)
                 if(type=="video"){
                  const thumnail=getVideoThumbnailUrl(postUrl)
                   const post=await adminMarketPost.updateOne({_id},{$set:{postUrl,url,thumnail,type,postDate}}) 
                    return res.status(200).json({
                   message:"Posted Successfully"
        })
                 }
                  const post=await adminMarketPost.updateOne({_id},{$set:{postUrl,url,type,postDate}}) 
                    return res.status(200).json({
                   message:"Posted Successfully"
        })
        }else{
           return res.status(401).json({
          message:"Something wrong please try again!"
        })
        }
    } catch (error) {
          return res.status(401).json({
          message:"Something wrong please try again!"
        }) 
    }
}
export const deletePost=async(req,res)=>{
    try {
    const{_id}=req.params
    const{postUrl}=req.body
    await deleteFromCloudinary(postUrl)
    await adminMarketPost.deleteOne({_id})
     return res.status(200).json({
                   message:"Post deleted Successfully"})
    } catch (error) {
        return res.status(401).json({
          message:"Something wrong please try again!"
        })  
    }
}

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