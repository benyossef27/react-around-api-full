const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controlers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');
const cors = require('cors');
const { limiter } = require('./helpers/limiter');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());
app.use(helmet());

app.use(cors());
app.options('*', cors());
app.use(auth);
app.use(requestLogger);
app.use(limiter);
app.use('/signin', userRouter);
app.use('/signup', userRouter);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use(errors());
app.get('*', (req, res) => {
  throw new NotFoundError();
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
