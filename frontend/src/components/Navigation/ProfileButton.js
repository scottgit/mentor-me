import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../../store/session';
import Confirm from '../Includes/Confirm';
import Icon from '../Includes/Icon';
import { ModalProvider } from '../Includes/Modal';
import ModalTrigger from '../Includes/ModalTrigger';

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
            <ModalProvider>
            <ModalTrigger buttonClasses='button profile-button' buttonText='Log Out'>
              <Confirm
                doAction={() => {
                  setShowMenu(false);
                  dispatch(logout());
                }}
                message='Did you wish to log out?'
              />
            </ModalTrigger>
            </ModalProvider>
          </div>
        </>
      )}
    </>
  )
}

export default ProfileButton
