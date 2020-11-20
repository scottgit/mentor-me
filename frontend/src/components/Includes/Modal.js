import React, {useContext, useRef, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useSelector, useDispatch} from 'react-redux';
import {closeModal} from '../../store/modal';

const ModalContext = React.createContext();

export const ModalProvider({children, message}) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  if(!children) {
    if (!message) message = 'Please confirm';
    handleSubmit = (e) => {
      e.preventDefault();
      // dispatch(closeModal());
      // setAnswer(e.target.value === 'true')
    }

    children = (
      <form onSubmit='handleSubmit' className='confirm-form'>
        <h2 className='confirm-form__message'>{message}</h2>
        <div className='confirm-form__buttons'>
          <button className='button' type='submit' value={true}>Yes</button>
          <button className='button' type='button' onClick={onClose}>Cancel</button>
        </div>
      </form>
    )
  }

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

const Modal = ({message, onClose, children}) => {
  const showModal = useSelector(state => state.showModal);
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState(false)

  if (!showModal) return answer;

  let handleSubmit;
  if(!children) {
    handleSubmit = (e) => {
      e.preventDefault();
      dispatch(closeModal());
      setAnswer(e.target.value === 'true')
    }
  };

  return (
    <div className='modal'>
      <Icon
        icon='times-circle' wrapperClasses={`modal-close`}
        click={onClose}
      />
      <div className='modal-content'>
        {children}
      </div>
    </div>
  )
}

export default Modal
