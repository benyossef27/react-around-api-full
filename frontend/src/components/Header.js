import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/header/header__title.svg";

export default function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Around The U.S." />
      <p className="header__email">{props.isLoggedIn ? props.user : ""}</p>
      <Link
        to={`${props.link}`}
        className="header__link"
        onClick={props.onLogout ? props.onLogout : null}
      >
        {props.description}
      </Link>
    </header>
  );
}
