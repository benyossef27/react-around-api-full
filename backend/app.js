const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./helpers/limiter');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controlers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');
const Errors = require('./errors/errors');
const auth = require('./middleware/auth');

const centralErrorHandler = require('./errors/centrelizedEror');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());
mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(helmet());

app.use(requestLogger);
app.use(limiter);
app.post(
  '/signin',
  auth,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(4).alphanum().required(),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(4).alphanum().required(),
    }),
  }),
  createUser
);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.get('*', () => {
  throw new Errors();
});
app.use(errors());
app.use(errorLogger);
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
