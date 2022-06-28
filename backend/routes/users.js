const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getCurrentUser,
  createUser,
} = require('../controlers/users');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:id', getUser);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  updateAvatar
);

// userRouter.post(
//   '/',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().min(8).alphanum().required(),
//     }),
//   }),
//   createUser
// );

module.exports = userRouter;
