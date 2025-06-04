import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware.js';
import ErrorHandler from '../middlewares/error.middleware.js';
import { userModel } from '../models/user.model.js';
import { generateToken } from '../utils/jwtToken.js';
import firebaseAdmin from '../config/firebase.config.js';

// Handle Firebase social login (Google/Facebook)
export const firebaseSocialLogin = catchAsyncErrors(async (req, res, next) => {
  console.log('Received Firebase social login request:', { provider: req.body.provider, userData: req.body.userData });
  const { idToken, provider, userData } = req.body;

  if (!idToken) {
    console.error('Firebase ID token missing');
    return next(new ErrorHandler('Firebase ID token is required', 400));
  }

  if (!firebaseAdmin) {
    console.error('Firebase admin SDK not initialized');
    return next(new ErrorHandler('Firebase authentication is not configured on the server', 501));
  }

  try {
    console.log('Verifying Firebase ID token...');
    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    console.log('Token verified successfully. User data:', { 
      email: decodedToken.email,
      uid: decodedToken.uid,
      provider 
    });
    
    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      console.error('No email found in decoded token');
      return next(new ErrorHandler('Email is required for authentication', 400));
    }

    // Check if user already exists
    console.log('Checking if user exists in MongoDB...');
    let user = await userModel.findOne({ email });

    if (!user) {
      console.log('User not found in MongoDB. Creating new user...');
      // Create a new user with data from both Firebase token and optional userData
      const newUserData = {
        // Use userData values if provided, otherwise fallback to Firebase token values
        fullName: (userData && userData.fullName) || name || 'User',
        email,
        phone: (userData && userData.phone) || '',
        country: (userData && userData.country) || '',  // Include the country from userData
        password: uid + process.env.JWT_SECRET, // Generate a secure password (they won't use it)
        role: (userData && userData.role) || 'user',
        image: picture || '',
        authProvider: provider,  // 'google' or 'facebook'
        firebaseUID: uid
      };
      
      console.log('Creating new user with data:', { ...newUserData, password: '[REDACTED]' });
      
      try {
        user = await userModel.create(newUserData);
        console.log('New user created successfully in MongoDB:', { userId: user._id });
      } catch (dbError) {
        console.error('Error creating user in MongoDB:', dbError);
        return next(new ErrorHandler(`Failed to create user in database: ${dbError.message}`, 500));
      }
    } else {
      console.log('User found in MongoDB. Updating user data...');
      // Update user with Firebase data if needed
      user.image = picture || user.image;
      user.authProvider = provider;
      user.firebaseUID = uid;
      
      try {
        await user.save();
        console.log('User updated successfully in MongoDB:', { userId: user._id });
      } catch (dbError) {
        console.error('Error updating user in MongoDB:', dbError);
        return next(new ErrorHandler(`Failed to update user in database: ${dbError.message}`, 500));
      }
    }

    console.log('Generating JWT token for user...');
    generateToken(user, `${provider} Login Successful`, 200, res);
  } catch (error) {
    console.error('Firebase authentication error:', error);
    return next(new ErrorHandler(`Firebase Authentication Error: ${error.message}`, 401));
  }
});

// Verify Firebase token for protected routes
export const verifyFirebaseToken = catchAsyncErrors(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new ErrorHandler('Firebase ID token is required', 400));
  }

  if (!firebaseAdmin) {
    return next(new ErrorHandler('Firebase authentication is not configured on the server', 501));
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const user = await userModel.findOne({ email: decodedToken.email });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Token verified successfully',
      user
    });
  } catch (error) {
    return next(new ErrorHandler(`Token verification failed: ${error.message}`, 401));
  }
});
