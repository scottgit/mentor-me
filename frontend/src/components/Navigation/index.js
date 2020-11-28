import React from 'react';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import ModalTrigger from '../Includes/ModalTrigger';
import LoginForm from '../LoginForm';
import Logo from '../Includes/Logo';

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);

  let sessionLinks;
  if(sessionUser) {
    sessionLinks = (
      <>
        {pendingCount !== 0 &&
        <li>
          <NavLink to='/pending' className='pending-count'>{pendingCount}</NavLink>
        </li>
        }
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
    <>
      <nav className='main-nav'>
        <NavLink exact to='/' className='main-nav__logo-link'>
          <Logo />
          <span>Mentor&nbsp;Me</span>
        </NavLink>
        <ul className='main-nav__list'>
          {sessionLinks}
        </ul>
      </nav>

        <nav className='sub-nav'>
        {
        sessionUser &&
          <ul className='sub-nav__list'>
            <li><NavLink to='/public/mentors' className='sub-nav__link'>Available Mentors</NavLink></li>
            <li><NavLink to='/public/mentees' className='sub-nav__link'>Potential Mentees</NavLink></li>
          </ul>
        }
        </nav>

    </>
  )
}

export default Navigation
