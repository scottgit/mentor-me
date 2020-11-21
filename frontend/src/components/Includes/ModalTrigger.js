import React, {useContext} from 'react';
import  Modal, {ModalProvider, ModalContext}  from '../Includes/Modal';


function Trigger({children, triggerComponent, buttonClasses, buttonText}) {
  const {showModal, setShowModal} = useContext(ModalContext);

  if (!triggerComponent) {
    triggerComponent = (
      <button className={buttonClasses} onClick={() => setShowModal(true)}>{buttonText}</button>
    )
  }

  return (
    <>
      {triggerComponent}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {children}
        </Modal>
      )}
    </>
  );
}

const ModalTrigger = (props) => {
  return (
    <ModalProvider>
      <Trigger {...props}/>
    </ModalProvider>
  )
}

export default ModalTrigger;
