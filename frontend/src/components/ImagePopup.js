export default function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_type_preview ${card && "popup_opened"}`}>
      <div className="popup__container popup__container_type_preview">
        <button
          type="button"
          className="popup__close popup__close_type_preview"
          onClick={onClose}
        ></button>
        <img
          className="popup__image popup__image_type_preview"
          src={card ? card.link : ""}
          alt={card ? card.name : ""}
        />
        <h2 className="popup__heading popup__heading_type_preview">
          {card ? card.name : ""}
        </h2>
      </div>
    </div>
  );
}
