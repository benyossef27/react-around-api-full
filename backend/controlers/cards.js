const Errors = require('../errors/errors');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const Card = require('../models/card');

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(() => new NotFoundError("Can't find this this id"))
    .then((card) => {
      if (card.owner.valueOf() !== req.user._id) {
        next(new ForbiddenError('Only the owner of the card can delete it'));
      } else
        Card.findOneAndDelete(req.params.cardId)
          .then((deletedCard) => res.send({ data: deletedCard }))
          .catch(next);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => new NotFoundError("Can't find any cards"))
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .orFail(() => new ServerError("Can't create card, please try again later"))
    .then((card) => res.status(201).send({ card }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      new NotFoundError('Card id not found.');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      new NotFoundError('Card id not found.');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};
