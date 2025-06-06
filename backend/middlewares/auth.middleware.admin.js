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
    req.admin = await adminModel.findById(decoded.id).select('-password'); // password exclude kiya

    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not found, invalid token' });
    }

    console.log("isAuthenticated middleware called");
    console.log("Authenticated user:", req.admin);
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
