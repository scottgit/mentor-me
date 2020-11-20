import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../../store/session';
import Icon from '../Includes/Icon';

const ProfileButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const {username, email} = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }
  const show = showMenu ? 'show' : '';
  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = (e) => {
      if (e.target.classList.contains('profile-menu') || e.target.closest('.profile-menu')) return;
      setShowMenu(false);
    }
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    if(!window.confirm(`Did you wish to logout?`)) {
      return;
    }
    setShowMenu(false);
    dispatch(logout())
  }

  return (
    <>
      <Icon icon='user' wrapperClasses={`profile-icon__user ${show}`}
      click={toggleMenu} />
      {(showMenu &&
        <>
          <Icon icon='times-circle' wrapperClasses='profile-icon__times-circle' click={toggleMenu} />
          <div className={`profile-menu ${show}`}>
            <div className='profile-info'>{username}</div>
            <div  className='profile-info'>{email}</div>
            <button className='button profile-button' onClick={handleLogout}>Log Out</button>
          </div>
        </>
      )}
    </>
  )
}

export default ProfileButton
