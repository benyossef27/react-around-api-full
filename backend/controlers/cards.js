const Card = require('../models/card');
const handleInvalidDataError = require('../errors/invalid-data-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found with that id');
      }
      res.send({ card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      handleInvalidDataError(err, res);
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send({ card });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send({ card });
    })
    .catch((err) => {
      next(err);
    });
};
