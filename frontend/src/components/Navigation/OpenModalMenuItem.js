import { useModal } from "../../context/Modal";

const OpenModalMenuItem = ({
  modalComponent, // component to render inside the modal
  itemText, // text of the item that opens the modal
  onItemClick, // optional: callback function that will be called once the item that opens the modal is clicked
  onModalClose, //optional: callback function that will be called once the modal is closed
}) => {
  const { setModalContent, setOnModalClose } = useModal();
  const handleOnClick = () => {
    if (typeof onButtonClick === "function") onItemClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };
  return <button onClick={handleOnClick}>{itemText}</button>;
};
export default OpenModalMenuItem;
