import fail from "../images/tooltip/tooltip_error.svg";
import succes from "../images/tooltip/tooltip_succes.svg";

export default function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      } `}
    >
      <div className="popup__container">
        <button
          className="popup__close"
          id="close_registration"
          type="button"
          onClick={props.onClose}
        />
        <img
          className="popup__registration-status"
          src={props.status === false ? fail : succes}
          alt="fail/succes"
        />
        <span className="popup__registration-text">
          {props.status === false
            ? "Oops, something went wrong! Please try again."
            : "Success! You have now been registered."}
        </span>
      </div>
    </div>
  );
}
