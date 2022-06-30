const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Errors = require('../errors/errors');

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Errors(401, 'Authorization Required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    throw new Errors(401, 'Authorization Required');
  }
  req.user = payload;

  next();
};
