import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLoginClick }) {
  const [values, setValues] = useState({ email: "", password: "" });

  function handleChange(evt) {
    const { type, value } = evt.target;
    setValues({ ...values, [type]: value });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLoginClick(values);
  }

  const navigate = useNavigate();
  return (
    <div className="sign">
      <h2 className="sign__title">Log in</h2>
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
        <button className="sign__button" type="submit">
          Log in
        </button>
      </form>
      <Link to="/signup" className="sign__link">
        Not a member yet? Sign up here!
      </Link>
    </div>
  );
}
