import React from 'react';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import ModalTrigger from '../Includes/ModalTrigger';
import LoginForm from '../LoginForm';
import Logo from '../Includes/Logo';

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
          <ModalTrigger buttonClasses='button main-nav__login' buttonText='Log In'>
            <LoginForm />
          </ModalTrigger>
        </li>
        <li>
          <NavLink exact to='/signup' className='logo-link'>
            <button type='button' className='button main-nav__signup'>Sign Up</button>
          </NavLink>
        </li>
      </>
    );
  }
  return (
    <nav className='main-nav'>
      <NavLink exact to='/' className='main-nav__logo-link'>
        <Logo />
        <span>Mentor&nbsp;Me</span>
      </NavLink>
      <ul className='main-nav__list'>
        {sessionLinks}
      </ul>
    </nav>
  )
}

export default Navigation
