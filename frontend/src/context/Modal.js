import { createContext, useRef, useState, useContext } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);
export const ModalProvider = (props) => {
  const modalRef = useRef();
  //data type:component,render inside modal
  const [modalContent, setModalContent] = useState(null);
  //data type: callback function, called when modal closing
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    //clear modal content
    setModalContent(null);
    if (typeof onModalClose === "function") {
      // If callback function is truthy, call the callback function and reset it to null:
      setOnModalClose(null); //why reset first???
      onModalClose();
    }
  };
  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // React component to render inside modal
    setModalContent, // function to set the React component to render inside modal
    setOnModalClose, // function to set the callback function to be called when modal is closing
    closeModal, //function to close the modal
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {props.children}
      </ModalContext.Provider>
      ;
      <div ref={modalRef} />
    </>
  );
};
//functional component
export const Modal = () => {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);
  if (!modalRef || !modalContent || !modalRef.current) return null;
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal}></div>
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  );
};
