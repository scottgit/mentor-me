import React, {useState} from 'react';

const Modal = ({Component, message}) => {
  const [modalClose, setModalClose] = useState(false);

  if (modalClose) return false;

  let handleSubmit;
  if(!Component) {
    handleSubmit = (e) => {
      e.preventDefault();
      setModalClose(true);
    }
  };

  return (
    <div className='modal-wrapper'>
      <div className='modal-positioner'>
        {
          Component ||

          <form onSubmit='handleSubmit' className='confirm-form'>
            <h2 className='confirm-form__message'>{message}</h2>
            <div className='confirm-form__buttons'>
              <button className='button' type='submit' value='true'>Yes</button>
              <button className='button' type='submit' value='false'>Cancel</button>
            </div>
          </form>
        }
      </div>
    </div>
  )
}

export default Modal
