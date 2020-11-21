import React , {useContext} from 'react';
import {ModalContext} from './Modal';

const Confirm = ({message, doAction}) => {
  const {setShowModal} = useContext(ModalContext);
  if (!message) message = 'Please confirm';

  const handleSubmit = (e) => {
    e.preventDefault();
    doAction();
  }

  return (
    <form onSubmit={handleSubmit} className='confirm-form'>
      <h2 className='confirm-form__message'>{message}</h2>
      <div className='confirm-form__buttons'>
        <button className='button confirm-form__submit --warning' type='submit'>Yes</button>
        <button className='button confirm-form__cancel' autoFocus type='button' onClick={() =>  setShowModal(false)}>Cancel</button>
      </div>
    </form>
  )
}

export default Confirm
