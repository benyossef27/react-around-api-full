import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../utils/useFormAndValidation";

export default function EditProfilePopup(props) {
  const { inputs, handleChange, errors, isValid } = useFormAndValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateUser({
      name: inputs.name,
      about: inputs.about,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Edit profile"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
      isValid={isValid}
    >
      <input
        id="name-input"
        name="name"
        type="text"
        placeholder="Name"
        className="popup__input popup__input_field_name"
        minLength="2"
        maxLength="40"
        required
        value={inputs.name || ""}
        onChange={handleChange}
      />
      <span
        id="name-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {errors.name}
      </span>
      <input
        id="job-input"
        name="about"
        type="text"
        placeholder="About me"
        className="popup__input popup__input_field_job"
        minLength="2"
        maxLength="200"
        required
        value={inputs.about || ""}
        onChange={handleChange}
      />
      <span
        id="job-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {errors.about}
      </span>
    </PopupWithForm>
  );
}
