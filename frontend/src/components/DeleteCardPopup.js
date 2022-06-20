import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useState } from "react";

export default function DeleteCardPopup(props) {
  const [isValid, setIsValid] = useState(true);
  function handleSubmit(evt) {
    evt.preventDefault();
    props.onCardDelete(props.card);
  }

  return (
    <PopupWithForm
      name="deleteCard"
      title="Are you sure?"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
      isValid={isValid}
    />
  );
}
