const Errors = require('../errors/errors');
const Card = require('../models/card');

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId }).then((card) => {
    if (!card) {
      throw new Errors(404, 'Card not found with that id');
    }
    if (card.owner.valueOf() !== req.user._id) {
      throw new Errors(403, 'Forbidden');
    }
    return Card.findOneAndDelete(req.params.cardId)
      .then((deletedCard) => res.send({ data: deletedCard }))
      .catch((err) => next(err));
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
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new Errors(404, 'Card not found');
      }
      res.send({ card });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new Errors(404, 'Card not found');
      }
      res.send({ card });
    })
    .catch((err) => {
      next(err);
    });
};
