// Global Error Handler Middleware
export const globalErrorHanlder = (err, req, res, next) => {
  console.log('--- In Global Error Handler Middleware ---', err);
  // Getting the status code. If status code is defined in error then use that status code,
  // or use 500 (Internal Server Error) as default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    success: false,
  });
};

