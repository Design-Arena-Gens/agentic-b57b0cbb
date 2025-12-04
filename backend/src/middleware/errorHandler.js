const { StatusCodes } = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  console.error(err);
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Unexpected error';
  res.status(status).json({ message });
};

module.exports = errorHandler;
