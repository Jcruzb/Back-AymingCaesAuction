const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const HttpStatus = require('http-status-codes');

module.exports.isAuthenticated = (req, res, next) => {
  const authorization = req.header('Authorization');

  if (!authorization) {
    return next(createError(HttpStatus.StatusCodes.UNAUTHORIZED, 'No authorization header provided'));
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(createError(HttpStatus.StatusCodes.UNAUTHORIZED, 'Invalid token format'));
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET , (err, decodedToken) => {
    if (err) {
      return next(createError(HttpStatus.StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
    }

    req.currentUser = decodedToken; // Guardamos todo el token decodificado
    next();
  });
};