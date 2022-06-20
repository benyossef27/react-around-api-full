import React from "react";

import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../utils/useFormAndValidation";

export default function AddPlacePopup(props) {
  const { inputs, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onAddPlaceSubmit({ name: inputs.name, link: inputs.link });
  }

  React.useEffect(() => {
    resetForm();
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="place"
      title="Add place"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
      isValid={isValid}
    >
      <input
        id="place-title-input"
        name="name"
        type="text"
        placeholder="Title"
        className={`popup__input popup__input_field_heading ${
          isValid ? "" : "popup__input_type_error"
        }`}
        minLength="1"
        maxLength="30"
        required
        value={inputs.name || ""}
        onChange={handleChange}
      />
      <span
        id="place-title-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {errors.name}
      </span>
      <input
        id="place-img-input"
        name="link"
        type="url"
        placeholder="Image Url"
        className={`popup__input popup__input_field_img ${
          isValid ? "" : "popup__input_type_error"
        }`}
        required
        value={inputs.link || ""}
        onChange={handleChange}
      />
      <span
        id="place-img-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {errors.link}
      </span>
    </PopupWithForm>
  );
}
