import React from "react";

class Api extends React.Component {
  constructor(props) {
    super(props);
    this._baseUrl = props.baseUrl;
    this._headers = props.headers;
  }
  /////////////custom fetch////////////////////////////
  _customFetch = (url, headers) => {
    return fetch(url, headers).then((res) =>
      res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    );
  };
  ///////////////////user profile////////////////////
  getUserInfo() {
    return this._customFetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }
  setUserInfo({ name, about }) {
    return this._customFetch(`${this._baseUrl}/users/me `, {
      headers: this._headers,
      method: "PATCH",

      body: JSON.stringify({
        name,
        about,
      }),
    });
  }
  setUserAvatar(data) {
    return this._customFetch(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({ avatar: data }),
    });
  }
  ////////////////////////cards//////////////////////////////////
  getInitialCards() {
    return this._customFetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }
  createCard(item) {
    return this._customFetch(`${this._baseUrl}/cards `, {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  deleteCard(id) {
    return this._customFetch(`${this._baseUrl}/cards/${id} `, {
      headers: this._headers,
      method: "DELETE",
    });
  }
  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this._customFetch(`${this._baseUrl}/cards/likes/${id}`, {
        headers: this._headers,
        method: "PUT",
      });
    } else {
      return this._customFetch(`${this._baseUrl}/cards/likes/${id}`, {
        headers: this._headers,
        method: "DELETE",
      });
    }
  }
}

///////////////////////////Api instance//////////////////////////////////////
const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-12",
  headers: {
    authorization: "ad179248-85aa-46f0-9788-27fa8afcb4c4",
    "Content-Type": "application/json",
  },
});
export default api;
