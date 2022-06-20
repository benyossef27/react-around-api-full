const express = require('express');

const helmet = require('helmet');

const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

app.get('/', (req, res) => {
  res.send({ Message: "we're on" });
});

app.use(helmet());

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // paste the _id of the test user created in the previous step
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('*', (req, res) => {
  const ERROR_404 = 404;
  res.status(ERROR_404).send({
    message: 'Requested resource not found',
  });
});

app.listen(PORT, () => {
  console.log(`lisning to ${PORT}`);
});
