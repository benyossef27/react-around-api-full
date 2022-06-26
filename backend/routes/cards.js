const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  deleteCard,
  createCard,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controlers/cards');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};
cardsRouter.get('/', getCards);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex(),
    }),
  }),
  deleteCard
);
cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createCard
);
cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex(),
    }),
  }),
  likeCard
);
cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex(),
    }),
  }),
  dislikeCard
);

module.exports = cardsRouter;
