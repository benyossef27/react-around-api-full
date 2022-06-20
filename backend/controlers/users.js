const User = require('../models/user');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

function errorHandler(err, res) {
  if (err.name === 'ValidationError') {
    res.status(ERROR_400).send({ message: 'Not a valid user profile' });
  } else {
    res.status(ERROR_500).send({ message: 'Internal Server Error' });
  }
}

module.exports.getUsers = (err, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => errorHandler(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({ message: 'User ID not found' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const opts = { runValidators: true };
  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((user) => res.send({ user }, { new: true }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const opts = { runValidators: true };
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((user) => res.send({ user }, { new: true }))
    .catch((err) => {
      errorHandler(err, res);
    });
};
