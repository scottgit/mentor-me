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
        <li><NavLink exact to='/login' activeClassName='active'>Login</NavLink></li>
        <li><NavLink exact to='/login' activeClassName='active'>Signup</NavLink></li>
      </>
    );
  }
  return (
    <nav className='main-nav'>
      <NavLink to='/' className='logo-link'><div className='logo'></div></NavLink>
      <ul className='main-nav__list'>
        <li><NavLink exact to='/' activeClassName='active'>Home</NavLink></li>
        {sessionLinks}
      </ul>
    </nav>
  )
}

export default Navigation
