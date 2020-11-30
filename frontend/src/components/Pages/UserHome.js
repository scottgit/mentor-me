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
    <main className='page'>
      <h2>Welcome {name}</h2>
      <section className='announcements'>
        {pendingCount !== 0 && <p>You have {pendingCount} <NavLink to='/pending'>pending connections</NavLink> waiting for acceptance or rejection.</p>}
      </section>
      { canBeMentee &&
        <section className='mentors'>
          <h3 className='mentor-list__title'>Your Mentors</h3>
          {(mentors && mentors.length &&
          <ul className='mentor-list user-listing'>
            {mentors.map(person => {
              const {id, username, goBy, picture, mentorDesc, gender, createdAt} = person;
              const connectionId = person.Connections.id;
              return (
              <li key={id} className='mentor-list__list-item'>
                {picture && <img src={picture} alt={username + ' as mentor'} className='mentor-list__img'/>}
                <h3 className='mentor-list__name'>{goBy || username}</h3>
                <p className='mentor-list__gender'>Identifies as {gender}</p>
                <p>User since {createdAt.date}</p>
                <p>{mentorDesc}</p>
                <div className='user-listing__button-group'>
                  <NavLink to={{
                    pathname: '/discussions',
                    state: {
                      connectionId,
                      type: 'latest'
                    }
                  }} className='button'>Discussions</NavLink>
                  <NavLink to={{
                    pathname: '/discussions',
                    state: {
                      connectionId,
                      type: 'new'
                    }
                  }} className='button'>New Discussion</NavLink>
                  {/* TODO <button className='button'>Your Goals</button> */}
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
          {(mentees && mentees.length &&
          <ul className='mentee-list user-listing'>
            {mentees.map(person => {
              const {id, username, goBy, picture, menteeDesc, gender, createdAt} = person;
              const connectionId = person.Connections.id;
              return (
              <li key={id} className='mentee-list__list-item'>
                {picture && <img src={picture} alt={username + ' as mentee'} className='mentee-list__img'/>}
                <h3 className='mentee-list__name'>{goBy || username}</h3>
                <p className='mentee-list__gender'>Identifies as {gender}</p>
                <p>User since {createdAt.date}</p>
                <p>{menteeDesc}</p>
                <div className='user-listing__button-group'>
                <NavLink to={{
                    pathname: '/discussions',
                    state: {
                      connectionId,
                      type: 'latest'
                    }
                  }} className='button'>Discussions</NavLink>
                  <NavLink to={{
                    pathname: '/discussions',
                    state: {
                      connectionId,
                      type: 'new'
                    }
                  }} className='button'>New Discussion</NavLink>
                  {/*TODO <button className='button'>Their Goals</button>
                  <button className='button'>New Goal</button> */}
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
    </main>
  )
}

export default UserHome
