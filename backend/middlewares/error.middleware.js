class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}


//--
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // MongoDB Duplicate Key
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((e) => e.message).join(", ");
    statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please login again.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token has expired. Please login again.";
    statusCode = 401;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};


export default ErrorHandler;
