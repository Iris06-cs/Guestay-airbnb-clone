import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the item that opens the modal
  onItemClick, // optional: callback function that will be called once the item that opens the modal is clicked
  onModalClose, //optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();
  const handleOnClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };
  return (
    <button
      id={itemText === "Log in" ? "login-button" : ""}
      onClick={handleOnClick}
    >
      {itemText}
    </button>
  );
}
export default OpenModalMenuItem;
