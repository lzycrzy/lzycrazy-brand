export const generateTokenAdmin = async (admin, message, statusCode, res) => {
  const token = admin.generateJsonWebToken();

  // Update lastLoginToken in DB
  admin.lastLoginToken = token;
  await admin.save({ validateBeforeSave: false });

  const { password, ...adminSafe } = admin.toObject(); // remove password

  res
    .status(statusCode)
    .cookie('token', token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .json({
      success: true,
      message,
      token,
      admin: adminSafe,
    });
};
