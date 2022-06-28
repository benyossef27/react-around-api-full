const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');
const Errors = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const options = { runValidators: true, new: true };

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Errors(404, 'No user found with that id');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new Errors(404, 'No user found with that id');
      }
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, _id } = req.body;
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
      })
    )
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id: id } = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, options)
    .then((user) => {
      if (!user) {
        throw new Errors(404, 'No user found with that id');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const avatar = req.body;
  const { _id: id } = req.user._id;
  User.findByIdAndUpdate(id, avatar, options)
    .then((user) => {
      if (!user) {
        throw new Errors(404, 'No user found with that id');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
