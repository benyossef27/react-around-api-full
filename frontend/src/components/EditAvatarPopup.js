import React from "react";
import { useFormAndValidation } from "../utils/useFormAndValidation";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const { inputs, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: inputs.link,
    });
  }

  React.useEffect(() => {
    resetForm({});
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="avatar"
      title="Edit avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
      isValid={isValid}
    >
      <input
        id="avatar-img-input"
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
        id="avatar-img-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {errors.link}
      </span>
    </PopupWithForm>
  );
}
