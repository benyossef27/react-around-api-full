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

  payload = jwt.verify(
    token,
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
  );
  req.user = payload;
  next();
};
