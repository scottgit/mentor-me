import React from 'react';
import {useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';

const UserHome = () => {
  const sessionUser = useSelector(state => state.session.user);
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);
  let mentees = useSelector(state => state.session.mentees);
  let mentors = useSelector(state => state.session.mentors);
  const name = (sessionUser.goBy || sessionUser.userName);
  const canBeMentor = sessionUser.mentorDesc !== '';
  const canBeMentee = sessionUser.menteeDesc !== '';

  return (
    <>
      <h2>Welcome {name}</h2>
      <section className='announcements'>
        {pendingCount && <p>You have {pendingCount} <NavLink to='/pending'>pending connections</NavLink> waiting for acceptance or rejection.</p>}
      </section>
      { canBeMentee &&
        <section className='mentors'>
          <h3 className='mentor-list__title'>Your Mentors</h3>
          {(mentors.length !== 0 &&
          <ul className='mentor-list user-listing'>
            {mentors.map(person => {
              const {id, username, goBy, picture, mentorDesc, createdAt} = person;
              return (
              <li key={id} className='mentor-list__list-item'>
                {picture && <img src={picture} alt={username + ' as mentor'} className='mentor-list__img'/>}
                <h3 className='mentor-list__name'>{goBy || username}</h3>
                <p>User since {createdAt.date}</p>
                <p>{mentorDesc}</p>
                <div className='user-listing__button-group'>
                  <button className='button'>Discussions</button>
                  <button className='button'>New Discussion</button>
                  <button className='button'>Your Goals</button>
                </div>
              </li>
              )
            })}
          </ul>)
          ||
          <>
            <p className='no-list'>You have no mentors yet.</p>
            <p className='no-list'>Reachout to someone you know to join the site, or look in the public space for available connections.</p>
          </>
          }
        </section>
      }
      { canBeMentor &&
        <section className='mentees'>
          <h3 className='mentee-list__title'>Your Mentees</h3>
          {(mentees.length !== 0 &&
          <ul className='mentee-list user-listing'>
            {mentees.map(person => {
              const {id, username, goBy, picture, menteeDesc, createdAt} = person;
              return (
              <li key={id} className='mentee-list__list-item'>
                {picture && <img src={picture} alt={username + ' as mentee'} className='mentee-list__img'/>}
                <h3 className='mentee-list__name'>{goBy || username}</h3>
                <p>User since {createdAt.date}</p>
                <p>{menteeDesc}</p>
                <div className='user-listing__button-group'>
                  <button className='button'>Discussions</button>
                  <button className='button'>New Discussion</button>
                  <button className='button'>Their Goals</button>
                  <button className='button'>New Goal</button>
                </div>
              </li>
              )
            })}
          </ul>)
          ||
          <p className='no-list'>You have no mentees yet.</p>
          }
        </section>
      }
    </>
  )
}

export default UserHome
