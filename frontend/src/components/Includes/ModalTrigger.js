import React, {useContext} from 'react';
import  Modal, {ModalContext}  from '../Includes/Modal';


function ModalTrigger({children, triggerComponent, buttonClasses, buttonText}) {
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

export default ModalTrigger;
