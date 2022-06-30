const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Authorization Required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError('Invalid token provided'));
  }
  req.user = payload;
  next();
};
