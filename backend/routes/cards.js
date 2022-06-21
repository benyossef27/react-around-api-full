const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getCards,
  creatCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controlers/cards');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const cardsRouter = express.Router();

cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  creatCard
);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:_id', deleteCard);
cardsRouter.put('/:_id/likes', likeCard);
cardsRouter.delete('/:_id/likes', dislikeCard);

module.exports = cardsRouter;
