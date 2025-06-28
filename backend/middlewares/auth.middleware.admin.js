// import jwt from 'jsonwebtoken';
// import { adminModel } from '../models/admin.model.js';

// export const isAuthenticatedAdmin = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return res.status(401).json({ message: 'Please login to access this resource' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');

//     const admin = await adminModel.findById(decoded.id).select('+password +lastLoginToken');

//     if (!admin) {
//       return res.status(401).json({ message: 'Admin not found, invalid token' });
//     }

//     // Check if token matches lastLoginToken in DB
//     if (admin.lastLoginToken !== token) {
//       return res.status(401).json({ message: 'Token invalidated, please login again' });
//     }

//     req.admin = admin;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };


// // Role-based auth
// export const authorizeRolesAdimin = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.admin.role)) {
//       return res.status(403).json({
//         message: `Role '${req.admin.role}' is not authorized to access this resource`,
//       });
//     }
//     next();
//   };
// };



import jwt from 'jsonwebtoken';
import { adminModel } from '../models/admin.model.js';


export const isAuthenticatedAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Please login to access this resource' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'defaultSecret',
    );

    req.admin = await adminModel.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not found, invalid token' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeRolesAdimin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: `Role '${req.admin.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
