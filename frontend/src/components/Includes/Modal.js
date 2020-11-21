import React, {useContext, useRef, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Icon from './Icon'

const ModalContext = React.createContext();

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
      <div ref={modalRef} />
    </>
  );
}

 const Modal = ({onClose, children}) => {
  const modalNode = useContext(ModalContext);

  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div id='modal' className='modal'>
      <div id='modal-content' className='modal-content'>
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
