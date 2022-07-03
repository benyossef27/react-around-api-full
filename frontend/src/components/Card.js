import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card({ onCardClick, card, onCardDelete, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);
  function handleClick() {
    onCardClick(card);
  }
  function handleDeleteClick() {
    onCardDelete(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? "" : "card__delete-button_hidden"
  }`;
  const isLiked = currentUser && card.likes.includes(currentUser._id);
  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_black" : ""
  }`;
  return (
    <div className="card">
      <img
        className="card__image"
        onClick={handleClick}
        style={{ backgroundColor: "black" }}
        src={card.link}
        alt={card.name}
        aria-label={card.name}
      />
      <button
        className={cardDeleteButtonClassName}
        type="button"
        aria-label="delete"
        onClick={handleDeleteClick}
      />
      <div className="card__box">
        <h2 className="card__name">{card.name}</h2>
        <div className="card__like-box">
          <button
            aria-label="like"
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          />
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </div>
  );
}
