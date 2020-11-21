import React, {useContext, useRef, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Icon from './Icon'

export const ModalContext = React.createContext();

export const ModalProvider = ({children}) => {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div id='modal' ref={modalRef} />
    </>
  );
}

 const Modal = ({onClose, children}) => {
  const modalNode = useContext(ModalContext);

  if (!modalNode) return null;

  const bubbledClose = (e) => {
    const doClose = e.target.getAttribute('data-bubble-close');
    if (doClose) setTimeout(onClose,0);
  }

  return ReactDOM.createPortal(
    <div className='modal' onClick={bubbledClose}>
      <div className='modal-content'>
        <Icon
          icon='times-circle' wrapperClasses={`modal-close`}
          click={onClose}
        />
        {children}
      </div>
    </div>,
    modalNode
  );
}

export default Modal
