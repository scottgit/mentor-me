import React from 'react';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import ModalTrigger from '../Includes/ModalTrigger';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';
import { ModalProvider } from '../Includes/Modal';

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if(sessionUser) {
    sessionLinks = (
    <>
      <li className='profile-item'><ProfileButton /></li>
      </>
    );
  }
  else {
    sessionLinks = (
      <>
        <li>
          <ModalProvider>
          <ModalTrigger buttonClasses='button main-nav__login' buttonText='Log In'>
            <LoginForm />
          </ModalTrigger>
          </ModalProvider>
        </li>
        <li>
          <ModalProvider>
          <ModalTrigger buttonClasses='button main-nav__signup' buttonText='Sign Up'>
            <SignupForm />
          </ModalTrigger>
          </ModalProvider>
        </li>
      </>
    );
  }
  return (
    <nav className='main-nav'>
      <NavLink exact to='/' className='logo-link'>
        <div className='logo'></div>
      </NavLink>
      <ul className='main-nav__list'>
        {sessionLinks}
      </ul>
    </nav>
  )
}

export default Navigation
