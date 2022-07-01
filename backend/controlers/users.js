const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const options = { runValidators: true, new: true };

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError("can't find this user"))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError("can't find this user"))
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new AuthError('Incorrect email or password.'))
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      res.send({ token }).catch(() => {
        next(new AuthError('Incorrect email or password'));
      });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => new NotFoundError("can't find user"))
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  let email;
  if (!validator.isEmail(req.body.email)) {
    email = null;
  } else {
    email = req.body.email;
  }
  bcrypt
    .hash(req.body.password, 10)

    .then((password) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password,
      }).catch(() => {
        next(new ConflictError('Email already taken'));
      })
    )

    .then((user) => {
      res.status(201).send({ id: user._id });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id: id } = req.user;
  User.findByIdAndUpdate(id, { name, about }, options)
    .orFail(() => new NotFoundError("Can't update this user, id not found"))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const avatar = req.body;
  const { _id: id } = req.user;
  User.findByIdAndUpdate(id, avatar, options)
    .orFail(
      () => new NotFoundError("Can't update this avatar, user id not found")
    )
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
