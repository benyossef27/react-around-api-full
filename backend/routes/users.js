const express = require('express');

const userRouter = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controlers/users');

userRouter.get('/', getUsers);
userRouter.get('/:_id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
