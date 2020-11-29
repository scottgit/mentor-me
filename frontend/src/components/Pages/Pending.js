import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {handleConnectionsChange} from '../../store/session';
import {establishConnection, declineConnection, deleteConnection} from '../../store/connection';
import DiscussionView from '../Includes/DiscussionView';

const Pending = () => {
  const sessionUser = useSelector(state => state.session.user);
  const sessionUserId = sessionUser.id;
  const invites = useSelector(state => state.session.invites);
  const requests = useSelector(state => state.session.requests);
  const allConnections = useSelector(state => state.session.connections);
  const dispatch = useDispatch();
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);


  useEffect(() => {

  }, [invites, requests]);

  const acceptClick = async (e) => {
    await dispatch(establishConnection(sessionUserId, e.target.value)).catch((res) => {
        if (res.data && res.data.errors) {
          //TODO make fancy acknowledge
          alert('There was an issue accepting this connection.')
        }
    });
    dispatch(handleConnectionsChange(sessionUser));
  }

  const declineClick = async (e) => {
    await dispatch(declineConnection(sessionUserId, e.target.value)).catch((res) => {
      if (res.data && res.data.errors) {
        //TODO make fancy acknowledge
        alert('There was an issue declining this connection.')
      }
    });
    dispatch(handleConnectionsChange(sessionUser));
  }

  const withdrawClick = async (e) => {
    await dispatch(deleteConnection(sessionUserId, e.target.value)).catch((res) => {
      if (res.data && res.data.errors) {
        //TODO make fancy acknowledge
        alert('There was an issue withdrawing this connection.')
      }
    });
    dispatch(handleConnectionsChange(sessionUser));
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
              const {id, username, goBy, picture, mentorDesc, createdAt} = person;
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
                  {picture && <img src={picture} alt={username + ' as mentor'} className='pending-list__img'/>}
                  <h3 className='pending-list__name'>{goBy || username}</h3>
                  <p className='pending-list__user-time' >User since {createdAt.date}</p>
                  <div className='pending-list__button-group'>
                    {!sessionUserInitiated &&
                    <>
                      <button className='button' value={connectionId} onClick={acceptClick}>Accept</button>
                      <button className='button' value={connectionId} onClick={declineClick}>Decline</button>
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
              const {id, username, goBy, picture, menteeDesc, createdAt} = person;
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
                  <p className='pending-list__user-time'>User since {createdAt.date}</p>
                  <p className='pending-list__description'>{menteeDesc}</p>
                  <div className='pending-list__button-group'>
                    {!sessionUserInitiated &&
                    <>
                      <button className='button' value={connectionId} onClick={acceptClick}>Accept</button>
                      <button className='button' value={connectionId} onClick={declineClick}>Decline</button>
                    </>}
                    {sessionUserInitiated &&
                      <button className='button' value={connectionId} onClick={withdrawClick}>Withdraw Request</button>
                    }
                  </div>
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
