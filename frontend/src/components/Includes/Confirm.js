import React from 'react';

const Confirm = ({message, onClose, doAction}) => {
  if (!message) message = 'Please confirm';

  const handleSubmit = (e) => {
    e.preventDefault();
    doAction();
  }

  return (
    <form onSubmit={handleSubmit} className='confirm-form'>
      <h2 className='confirm-form__message'>{message}</h2>
      <div className='confirm-form__buttons'>
        <button className='button confirm-form__submit --warning' type='submit' data-bubble-close='true'>Yes</button>
        <button className='button confirm-form__cancel' autoFocus type='button' data-bubble-close='true'>Cancel</button>
      </div>
    </form>
  )
}

export default Confirm
