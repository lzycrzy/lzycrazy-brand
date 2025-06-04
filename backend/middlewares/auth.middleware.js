import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import firebaseAdmin from '../config/firebase.config.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    // Check for JWT token in cookies (traditional auth)
    const { token } = req.cookies;
    
    // Check for Firebase token in headers
    const firebaseToken = req.headers.authorization?.split('Bearer ')[1];
    
    // No authentication provided
    if (!token && !firebaseToken) {
      return res
        .status(401)
        .json({ message: 'Please login to access this resource' });
    }
    
    // Try JWT authentication first if token exists
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'defaultSecret'
        );
        req.user = await userModel.findById(decoded.id).select('-password');
        
        if (req.user) {
          return next();
        }
      } catch (jwtError) {
        // JWT verification failed, try Firebase next
        console.log('JWT verification failed, trying Firebase');
      }
    }
    
    // Try Firebase authentication if token exists and JWT failed or wasn't provided
    if (firebaseToken && firebaseAdmin) {
      try {
        const decodedFirebaseToken = await firebaseAdmin.auth().verifyIdToken(firebaseToken);
        const { email, uid } = decodedFirebaseToken;
        
        // Find user by email from Firebase token
        req.user = await userModel.findOne({ email });
        
        if (!req.user) {
          return res.status(401).json({ message: 'User not found with the provided Firebase token' });
        }
        
        return next();
      } catch (firebaseError) {
        return res.status(401).json({ message: 'Invalid or expired Firebase token' });
      }
    } else if (firebaseToken && !firebaseAdmin) {
      return res.status(501).json({ message: 'Firebase authentication is not configured on the server' });
    }
    
    // If we reach here, both authentication methods failed
    return res.status(401).json({ message: 'Authentication failed' });
  } catch (error) {
    return res.status(401).json({ message: 'Authentication error: ' + error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
