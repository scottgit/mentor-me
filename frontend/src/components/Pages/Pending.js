import React from 'react';
import {useSelector} from 'react-redux';

const Pending = () => {
  const invites = useSelector(state => state.session.invites);
  const requests = useSelector(state => state.session.requests);
  return (
    <>
      <h2>Pending Connections</h2>
      <p>Please enter into discussion as needed and take action on these pending connections.</p>
      { invites.length !== 0 &&
        <section className='invites'>
          <h3 className='pending-list__title'>Your Invitations from Mentors</h3>
          <ul className='pending-list'>
            {invites.map(person => {
              const {id, username, goBy, picture, mentorDesc, createdAt} = person;
              return (
              <li key={id} className='pending-list__list-item'>
                {picture && <img src={picture} alt={username + ' as mentor'} className='pending-list__img'/>}
                <h3 className='pending-list__name'>{goBy || username}</h3>
                <p>User since {createdAt.date}</p>
                <p>{mentorDesc}</p>
                <div className='pending-list__button-group'>
                  <button className='button'>Accept</button>
                  <button className='button'>Decline</button>
                </div>
              </li>
              )
            })}
          </ul>
        </section>
      }
    </>
  )
}

export default Pending
