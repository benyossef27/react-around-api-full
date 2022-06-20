const express = require('express');

const cardsRouter = express.Router();
const {
  getCards,
  creatCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controlers/cards');

cardsRouter.post('/', creatCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:_id', deleteCard);
cardsRouter.put('/:_id/likes', likeCard);
cardsRouter.delete('/:_id/likes', dislikeCard);

module.exports = cardsRouter;
