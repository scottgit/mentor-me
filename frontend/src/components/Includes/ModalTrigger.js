import React, { useState } from 'react';
import  Modal  from '../Includes/Modal';

function ModalTrigger({children, triggerComponent, buttonClasses, buttonText}) {
  const [showModal, setShowModal] = useState(false);

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
