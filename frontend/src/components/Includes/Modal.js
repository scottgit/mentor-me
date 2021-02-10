import React, {useContext, useRef, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Icon from './Icon'

export const ModalContext = React.createContext();

export const ModalProvider = ({children}) => {
  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState({modalNode: null, showModal, setShowModal});

  useEffect(() => {
    const modalNode = modalRef.current;
    setValue({modalNode, showModal, setShowModal});
  }, [modalRef, showModal]);

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div className={`modal-wrapper ${showModal ? 'show' : ''}`} ref={modalRef} />
    </>
  );
}

 const Modal = ({children}) => {
  const {modalNode, setShowModal} = useContext(ModalContext);

  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div className='modal'>
      <div className='modal-content'>
        <Icon
          icon='times-circle' wrapperClasses={`modal-close`}
          click={() => setShowModal(false)}
        />
        {children}
      </div>
    </div>,
    modalNode
  );
}

export default Modal
