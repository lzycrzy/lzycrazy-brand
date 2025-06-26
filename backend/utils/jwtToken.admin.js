export const generateTokenAdmin = (admin, message, statusCode, res) => {
  const token = admin.generateJsonWebToken(); // must be defined on model

  res.status(statusCode).json({
    success: true,
    message,
    admin: {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
    token,
  });
};
