// export const generateTokenAdmin = (admin, message, statusCode, res) => {
//   const token = admin.generateJsonWebToken(); // must be defined on model

//   const { password, ...adminSafe } = admin.toObject(); // remove password

//   // res.status(statusCode).json({
//   //   success: true,
//   //   message,
//   //   admin: {
//   //     _id: admin._id,
//   //     fullName: admin.fullName,
//   //     email: admin.email,
//   //     role: admin.role,
//   //   },
//   //   token,
//   // });

//   res
//     .status(statusCode)
//     .cookie('token', token, {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
//       ),
//       httpOnly: true,
//       sameSite: 'None',
//       secure: true,
//       path: '/',
//     })
//     .json({
//       success: true,
//       message,
//       admin: {
//         _id: admin._id,
//         fullName: admin.fullName,
//         email: admin.email,
//         role: admin.role,
//       },
//       token,
//     });

// };


export const generateTokenAdmin = (admin, message, statusCode, res) => {
  const token = admin.generateJsonWebToken();

  // 👇 Clear old cookie first
  res.clearCookie('token', { path: '/' });

  // 👇 Set new cookie securely based on environment
  const isDev = process.env.NODE_ENV !== 'production';

  res
    .status(statusCode)
    .cookie('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      sameSite: isDev ? 'Lax' : 'None',
      secure: !isDev,
      path: '/',
    })
    .json({
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
