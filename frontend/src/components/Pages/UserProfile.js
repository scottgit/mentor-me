import React, {useState} from 'react';
import {useSelector} from 'react-redux';

const UserProfile = () => {
  const user = useSelector(state => state.session.user);
  const [showForm, setShowForm] = useState(false);
  const {
    email,
    username,
    goBy,
    picture,
    gender,
    mentorDesc,
    mentorIsPublic,
    menteeDesc,
    menteeIsPublic,
  } = user;

  return (
    <div className='page'>
      <h2 className='profile-title'>{goBy || username}'s Profile</h2>
      <p className='profile-announcement'>Coming soon! The ability to change this information.</p>
      { (picture &&
        <img className='profile-pic' src={picture} alt={goBy || username}/>
        )
        ||
        <div className='profile-pic'>(no picture set)</div>
      }

      <p className='profile-username'>Username: {username}</p>
      <p className='profile-email'>Email: {email}</p>
      <p className='profile-go-by'>Go by name: {goBy || '(not set)'}</p>
      <p className='profile-gender'>Gender: {gender}</p>
      <div className='profile-mentor-desc'>
        <p className='profile-desc-label'>Mentor Description {mentorIsPublic ? '(public)' : '(not public)'}:</p>
        <p  className='profile-desc'>{mentorDesc || '(not set)'}</p>
      </div>
      <div className='profile-mentee-desc'>
        <p className='profile-desc-label'>Mentor Description {menteeIsPublic ? '(public)' : '(not public)'}:</p>
        <p className='profile-desc'>{menteeDesc || '(not set)'}</p>
      </div>
    </div>
  )
}

export default UserProfile
