import React from 'react';


const Confirm = ({message, onClose}) => {

  if (!message) message = 'Please confirm';

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(closeModal());
    // setAnswer(e.target.value === 'true')
  }
  return (
    <form onSubmit='handleSubmit' className='confirm-form'>
      <h2 className='confirm-form__message'>{message}</h2>
      <div className='confirm-form__buttons'>
        <button className='button' type='submit' value={true}>Yes</button>
        <button className='button' type='button' onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}

export default Confirm
