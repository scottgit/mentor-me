import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {logout} from '../../store/session';
import Confirm from '../Includes/Confirm';
import Icon from '../Includes/Icon';
import ModalTrigger from '../Includes/ModalTrigger';

const ProfileButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const {goBy, username} = useSelector(state => state.session.user);
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);
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
            <div className='profile-links' onClick={toggleMenu}>
              <NavLink to='/profile' className='profile-link'>{goBy || username} Profile</NavLink>
              { pendingCount !== 0 &&
              <NavLink to='/pending' className='profile-link'>{pendingCount} Pending</NavLink>
              }
              <NavLink to={{
                pathname: '/discussions',
                state: {
                  connectionId: null,
                  type: null
                }}}
                className='profile-link'>
                  Discussions
              </NavLink>
            </div>

            <ModalTrigger buttonClasses='button profile-button' buttonText='Log Out'>
              <Confirm
                doAction={() => {
                  setShowMenu(false);
                  dispatch(logout());
                }}
                message='Did you wish to log out?'
              />
            </ModalTrigger>
          </div>
        </>
      )}
    </>
  )
}

export default ProfileButton
