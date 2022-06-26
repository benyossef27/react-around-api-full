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

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());
app.use(limiter);
mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());
app.use(helmet());
app.use(errors());
app.use(requestLogger);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.get('/users/me', userRouter);
app.get('/users', userRouter);
app.post('/users', userRouter);
app.post('/cards', cardsRouter);
app.delete('/cards/:cardsId', cardsRouter);
app.get('/cards', cardsRouter);
app.get('/users/:id', userRouter);
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});
app.patch('/users/me', userRouter);
app.patch('/users/me/avatar', userRouter);
app.put('/cards/:cardId/likes', cardsRouter);
app.delete('/cards/:cardId/likes', cardsRouter);
app.use(errorLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
