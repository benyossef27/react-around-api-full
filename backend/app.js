const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controlers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');

const { limiter } = require('./helpers/limiter');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());
app.options('*', cors());
mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());
app.use(helmet());

app.use(requestLogger);
app.use(limiter);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRouter);
app.post('/cards', cardsRouter);
app.delete('/cards/:cardsId', cardsRouter);
app.get('/cards', cardsRouter);
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});
app.put('/cards/:cardId/likes', cardsRouter);
app.delete('/cards/:cardId/likes', cardsRouter);
app.use(errors());
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
