import { React, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import { SpinnerInfinity } from "spinners-react";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "../utils/ProtectedRoute";
import InfoToolTip from "./InfoToolTip";
import { authorize, getContent, register } from "../utils/Auth";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [editAvaterButton, setEditAvatarButton] = useState("save");
  const [editProfileButton, setEditProfileButton] = useState("save");
  const [editAddPlaceButton, setEditAddPlaceButton] = useState("add");
  const [editDeleteCardButton, setEditDeleteCardButton] = useState("Yes");
  const [deleteCard, setDeleteCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleEditProfileClick() {
    setEditProfileButton("save");
    setIsEditProfilePopupOpen(true);
  }
  function handleAvatarClick() {
    setEditAvatarButton("save");
    setIsAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setEditAddPlaceButton("add");
    setIsAddPlacePopupOpen(true);
  }
  function handleDeleteClick(card) {
    setEditDeleteCardButton("Yes");
    setIsDeletePopupOpen(true);
    setDeleteCard(card);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    setEditProfileButton("saving...");
    api
      .setUserInfo({ name, about })
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function handleUpdateAvatar({ avatar }) {
    setEditAvatarButton("saving...");
    api
      .setUserAvatar(avatar)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function handleAddPlaceSubmit(info) {
    setEditAddPlaceButton("adding...");
    api
      .createCard(info)
      .then((res) => {
        setCards([res.card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => setCurrentUser(userData))
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
    const handlePopupClose = (evt) => {
      if (
        evt.target.classList.contains("popup_opened") ||
        evt.target.classList.contains("popup__close")
      ) {
        closeAllPopups();
      }
    };

    document.addEventListener("click", handlePopupClose);
    return () => document.removeEventListener("click", handlePopupClose);
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res.cards, ...cards);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like === currentUser._id);

    api
      .changeLikeCardStatus(card, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function handleCardDelete(card) {
    setEditDeleteCardButton("deleteing...");
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((deleted) => deleted._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  function handleChange(evt) {
    const { type, value } = evt.target;
    setValues({ ...values, [type]: value });
  }

  function handleRegitrationSubmit(values) {
    register(values)
      .then(() => {
        navigate("./signin");
        setRegistered(true);
      })
      .catch((err) => {
        console.log(err);
        setRegistered(false);
      })
      .finally(() => {
        setIsInfoToolTipOpen(true);
      });
  }

  const [token, setToken] = useState(localStorage.getItem("token"));

  function handleLogin(values) {
    authorize(values)
      .then((res) => {
        if (res) {
          setValues(res.email);
          setIsLoggedIn(true);
          setToken(res.token);
          navigate("/");
        } else {
          setIsInfoToolTipOpen(true);
          throw new Error("No token received from backend");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsInfoToolTipOpen(true);
      });
  }

  function handleCheckToken() {
    if (token) {
      localStorage.setItem("token", token);
      getContent(token)
        .then((res) => {
          setValues(res.user.email);
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(handleCheckToken, [navigate, token]);
  function handleLogout(e) {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setToken(null);
    setValues("");
    navigate("/signin");
  }

  return loading ? (
    <div className="page">
      <div className="root">
        <Header />
        <div className="loading">
          <SpinnerInfinity
            size={500}
            speed={100}
            color="cyan"
            display="flex"
            alignself="center"
          />
        </div>
        <p className="loading__text">Loading...</p>
        <Footer />
      </div>
    </div>
  ) : (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={
                <>
                  <Header
                    isLoggedIn={isLoggedIn}
                    user={values}
                    link={"/signin"}
                    description={"Log out"}
                    onLogout={handleLogout}
                  />
                  <Main
                    cards={cards}
                    onCardLike={handleCardLike}
                    onEditProfileClick={handleEditProfileClick}
                    onEditAvatarClick={handleAvatarClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardDelete={handleDeleteClick}
                    onCardClick={handleCardClick}
                  />
                  <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    buttonText={editProfileButton}
                  />
                  <EditAvatarPopup
                    isOpen={isAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    buttonText={editAvaterButton}
                  />
                  <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlaceSubmit={handleAddPlaceSubmit}
                    buttonText={editAddPlaceButton}
                  />
                  <DeleteCardPopup
                    isOpen={isDeletePopupOpen}
                    onClose={closeAllPopups}
                    onCardDelete={handleCardDelete}
                    buttonText={editDeleteCardButton}
                    card={deleteCard}
                  />
                  <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                  ></ImagePopup>
                  <Footer />
                </>
              }
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <>
              <Header
                user={values}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                link={"/signup"}
                description={"Sign up"}
              />
              <Login onLoginClick={handleLogin} onChange={handleChange} />
            </>
          }
        />
        <Route
          path="signup"
          element={
            <>
              <Header
                user={values}
                isLoggedIn={isLoggedIn}
                link={"/signin"}
                description={"Log in"}
              />
              <Register
                onRegisterClick={handleRegitrationSubmit}
                onChange={handleChange}
              />
            </>
          }
        />
      </Routes>
      <InfoToolTip
        name={"registration"}
        onClose={closeAllPopups}
        status={registered}
        isOpen={isInfoToolTipOpen}
      />
    </CurrentUserContext.Provider>
  );
}
