import React from 'react';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import ModalTrigger from '../Includes/ModalTrigger';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';


import { useDispatch} from 'react-redux';
import {logout} from '../../store/session';
import Confirm from '../Includes/Confirm';

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);

  const dispatch = useDispatch();

  let sessionLinks;
  if(sessionUser) {
    sessionLinks = (
    <>
      <li>
      <ModalTrigger buttonClasses='button profile-button' buttonText='Log Out'>
        <Confirm
          doAction={() => {

            //alert('here');
            //setShowMenu(false);
            dispatch(logout());
          }}
          message='Did you wish to log out?'
        />
      </ModalTrigger>
    </li>
      <li className='profile-item'><ProfileButton /></li>
      </>
    );
  }
  else {
    sessionLinks = (
      <>
        <li>
          <ModalTrigger buttonClasses='button main-nav__login' buttonText='Log In'>
            <LoginForm />
          </ModalTrigger>
        </li>
        <li>
          <ModalTrigger buttonClasses='button main-nav__signup' buttonText='Sign Up'>
            <SignupForm />
          </ModalTrigger>
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
