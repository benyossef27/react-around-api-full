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
const auth = require('./middleware/auth');
const ServerError = require('./errors/server-err');

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
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(4).required(),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(4).required(),
    }),
  }),
  createUser
);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardsRouter);
app.get('*', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.use(errors());
app.use(errorLogger);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'An error has occurred on the server' : err.message;
  res.status(statusCode).send({ message });
  next();
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
