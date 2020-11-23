import React from 'react';
import {useSelector} from 'react-redux';

const UserHome = () => {
  const sessionUser = useSelector(state => state.session.user);
  const name = (sessionUser.goBy || sessionUser.userName);
  const canBeMentor = sessionUser.mentorDesc !== '';
  const canBeMentee = sessionUser.menteeDesc !== '';
  return (
    <>
      <h2>Welcome {name}</h2>
      { canBeMentee &&
        <div className='mentors user_listing'>
          <h3>Your Mentors</h3>
          
        </div>
      }
      { canBeMentor &&
        <div className='mentees user_listing'>
          <h3>Your Mentees</h3>
        </div>
      }
    </>
  )
}

export default UserHome
