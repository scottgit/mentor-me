import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {handleConnectionsChange} from '../../store/session';
import DiscussionView from '../Includes/DiscussionView';
import {fetch} from '../../store/csrf';

const Pending = () => {
  const sessionUser = useSelector(state => state.session.user);
  const sessionUserId = sessionUser.id;
  const invites = useSelector(state => state.session.invites);
  const requests = useSelector(state => state.session.requests);
  const allConnections = useSelector(state => state.session.connections);
  const dispatch = useDispatch();
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);

  // useEffect(() => {}, [invites, requests, pendingCount]);

  const statusUpdateClick = async ({connectionId, status}, e) => {
    try {
      const res = await fetch(
        `/api/users/${sessionUserId}/status`,
        { method: 'PATCH',
          body: JSON.stringify({id: connectionId, status})
        }
      );
      if(!res.ok) throw res;
      if (res.data.connection) {
        dispatch(handleConnectionsChange(sessionUser));
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  const withdrawClick = async (e) => {
    const connectionId = e.target.value;
    try {
      const res = await fetch(
        `/api/users/${sessionUserId}/withdraw`,
        { method: 'DELETE',
          body: JSON.stringify({id: connectionId})
        }
      );
      if(!res.ok) throw res;
      if (res.data.success) {
        dispatch(handleConnectionsChange(sessionUser));
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  return ( //TODO STYLING FOR THE PENDING LIST
    <main className='page'>
      <h2>Pending Connections</h2>
      { (pendingCount !== 0 &&
      <p>Please enter into discussion as needed and take action on these pending connections.</p>)
       ||
       <p>You do not have any currently pending connections.</p>
      }
      { invites.length !== 0 &&
        <section className='invites'>
          <h3 className='pending-list__title'>Your Invitations from or Requests to Mentors</h3>
          <ul className='pending-list'>
            {invites.map(person => {
              const {id, username, goBy, picture, mentorDesc, gender, createdAt} = person;
              const {date: sinceDate, time: sinceTime} = person.Connections.createdAt;
              const connectionId = person.Connections.id;
              const discussionId = allConnections[connectionId].discussions[0].id;
              const sessionUserInitiated = person.Connections.initiatorId === sessionUserId;
              const viewState = {
                discussion: null,
                othersName: goBy || username,
                yourId: sessionUserId,
                discussionId,
              };


              return (
              <li key={id} className={`pending-list__list-item ${sessionUserInitiated ? 'user-initiated' : ''}`}>
                <div className='pending-list__info'>
                  {(sessionUserInitiated && <p>You intiated this request to this Mentor.</p>)
                  || <p>You have been invited by this Mentor.</p>}
                  <p className='pending-list__createdAt'>Pending since: {sinceDate} {sinceTime}</p>
                  {picture && <img src={picture} alt={(goBy || username) + ' as mentor'} className='pending-list__img'/>}
                  <h3 className='pending-list__name'>{goBy || username}</h3>
                  <p className='pending-list__gender'>Identifies as {gender}</p>
                  <p className='pending-list__user-time' >User since {createdAt.date}</p>
                  <div className='pending-list__button-group'>
                    {!sessionUserInitiated &&
                    <>
                      <button className='button' value='' onClick={statusUpdateClick.bind(null, {connectionId, status: 'established'})}>Accept</button>
                      <button className='button' value='' onClick={statusUpdateClick.bind(null, {connectionId, status: 'rejected'})}>Decline</button>
                    </>}
                    {sessionUserInitiated &&
                      <button className='button' value={connectionId} onClick={withdrawClick}>Withdraw Request</button>
                    }
                  </div>
                  <p className='pending-list__description'>{mentorDesc}</p>
                </div>
                <div className='pending-list__discussion'>
                  <DiscussionView {...viewState} />
                </div>
              </li>
              )
            })}
          </ul>
        </section>
      }
      { requests.length !== 0 &&
        <section className='requests'>
          <h3 className='pending-list__title'>Your Requests from or Invitations to Mentees</h3>
          <ul className='pending-list'>
            {requests.map(person => {
              const {id, username, goBy, picture, menteeDesc, gender, createdAt} = person;
              const {date: sinceDate, time: sinceTime} = person.Connections.createdAt;
              const connectionId = person.Connections.id;
              const discussionId = allConnections[connectionId].discussions[0].id;
              const sessionUserInitiated = person.Connections.initiatorId === sessionUserId;
              const viewState = {
                discussion: null,
                othersName: goBy || username,
                yourId: sessionUserId,
                discussionId,
              };

              return (
              <li key={id} className={`pending-list__list-item ${sessionUserInitiated ? 'user-initiated' : ''}`}>
                <div className='pending-list__info'>
                  {(sessionUserInitiated && <p>You intiated this invite to this Mentee.</p>)
                  || <p>You have been requested as a Mentor by this Mentee.</p>}
                  <p className='pending-list__createdAt'>Pending since: {sinceDate} {sinceTime}</p>
                  {picture && <img src={picture} alt={username + ' as mentee'} className='pending-list__img'/>}
                  <h3 className='pending-list__name'>{goBy || username}</h3>
                  <p className='pending-list__gender'>Identifies as {gender}</p>
                  <p className='pending-list__user-time'>User since {createdAt.date}</p>
                  <div className='pending-list__button-group'>
                    {!sessionUserInitiated &&
                    <>
                      <button className='button' value='' onClick={statusUpdateClick.bind(null, {connectionId, status: 'established'})}>Accept</button>
                      <button className='button' value='' onClick={statusUpdateClick.bind(null, {connectionId, status: 'rejected'})}>Decline</button>
                    </>}
                    {sessionUserInitiated &&
                      <button className='button' value={connectionId} onClick={withdrawClick}>Withdraw Request</button>
                    }
                  </div>
                  <p className='pending-list__description'>{menteeDesc}</p>
                </div>
                <div className='pending-list__discussion'>
                  <DiscussionView {...viewState} />
                </div>
              </li>
              )
            })}
          </ul>
        </section>
      }
    </main>
  )
}

export default Pending
