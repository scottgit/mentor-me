import React from 'react';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if(sessionUser) {
    sessionLinks = (
      <li className='profile-item'><ProfileButton /></li>
    );
  }
  else {
    sessionLinks = (
      <>
        <li><NavLink exact to='/login' className='button main-nav__login'>Login</NavLink></li>
        <li><NavLink exact to='/login' className='button main-nav__signup'>Signup</NavLink></li>
      </>
    );
  }
  return (
    <nav className='main-nav'>
      <NavLink exact to='/' className='logo-link'><div className='logo'></div></NavLink>
      <ul className='main-nav__list'>
        {sessionLinks}
      </ul>
    </nav>
  )
}

export default Navigation
