import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ onRegisterClick }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  function handleChange(evt) {
    const { type, value } = evt.target;
    setValues({ ...values, [type]: value });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegisterClick(values);
  }
  return (
    <div className="sign">
      <h2 className="sign__title">Sign up</h2>
      <form
        className="sign__form"
        action="#"
        title="Log in"
        onSubmit={handleSubmit}
      >
        <input
          className="sign__input"
          type="email"
          placeholder="Email"
          required
          value={values.email}
          onChange={handleChange}
          autoComplete={"current-email"}
        />
        <input
          className="sign__input"
          type="password"
          placeholder="Password"
          required
          value={values.password}
          onChange={handleChange}
          autoComplete={"current-password"}
        />
        <button type="submit" className="sign__button">
          Sign up
        </button>
      </form>
      <Link to="/signin" className="sign__link">
        Already a member? Log in here!
      </Link>
    </div>
  );
}
