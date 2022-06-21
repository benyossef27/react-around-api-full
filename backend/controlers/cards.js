const Card = require('../models/card');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;
const errorMessage404 = { message: 'Card not found' };
function errorHandler(err, res) {
  if (err.name === 'ValidationError') {
    res.status(ERROR_400).send({ message: 'Not a valid card' });
  } else {
    res.status(ERROR_500).send({ message: 'Internal Server Error' });
  }
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => errorHandler(err, res));
};

module.exports.creatCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)

    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(ERROR_404).send(errorMessage404);
      }
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_404).send(errorMessage404);
      }
    })
    .catch((err) => {
      errorHandler(err, res);
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_404).send(errorMessage404);
      }
    })
    .catch((err) => {
      errorHandler(err, res);
    });
