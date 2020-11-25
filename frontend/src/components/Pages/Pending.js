import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {handleConnectionsChange} from '../../store/session';
import {establishConnection, declineConnection, deleteConnection} from '../../store/connection';

const Pending = () => {
  const sessionUserId = useSelector(state => state.session.user.id);
  const invites = useSelector(state => state.session.invites);
  const requests = useSelector(state => state.session.requests);
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
    dispatch(handleConnectionsChange(sessionUserId));
  }

  const declineClick = async (e) => {
    await dispatch(declineConnection(sessionUserId, e.target.value)).catch((res) => {
      if (res.data && res.data.errors) {
        //TODO make fancy acknowledge
        alert('There was an issue declining this connection.')
      }
    });
    dispatch(handleConnectionsChange(sessionUserId));
  }

  const withdrawClick = async (e) => {
    await dispatch(deleteConnection(sessionUserId, e.target.value)).catch((res) => {
      if (res.data && res.data.errors) {
        //TODO make fancy acknowledge
        alert('There was an issue withdrawing this connection.')
      }
    });
    dispatch(handleConnectionsChange(sessionUserId));
  }
  return (
    <>
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
              const sessionUserInitiated = person.Connections.initiatorId === sessionUserId;
              return (
              <li key={id} className={`pending-list__list-item ${sessionUserInitiated ? 'user-initiated' : ''}`}>
                {sessionUserInitiated && <p>You intiated this request to this Mentor.</p>}
                {picture && <img src={picture} alt={username + ' as mentor'} className='pending-list__img'/>}
                <h3 className='pending-list__name'>{goBy || username}</h3>
                <p>User since {createdAt.date}</p>
                <p>{mentorDesc}</p>
                <p className='pending-list__createdAt'>Pending since: {sinceDate} {sinceTime}</p>
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
                <div className='discussion'>Discussion goes here.</div>
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
              const {id, username, goBy, picture, mentorDesc, createdAt} = person;
              const {date: sinceDate, time: sinceTime} = person.Connections.createdAt;
              const connectionId = person.Connections.id;
              const sessionUserInitiated = person.Connections.initiatorId === sessionUserId;
              return (
              <li key={id} className={`pending-list__list-item ${sessionUserInitiated ? 'user-initiated' : ''}`}>
                {sessionUserInitiated && <p>You intiated this invite to this Mentee.</p>}
                {picture && <img src={picture} alt={username + ' as mentee'} className='pending-list__img'/>}
                <h3 className='pending-list__name'>{goBy || username}</h3>
                <p>User since {createdAt.date}</p>
                <p>{mentorDesc}</p>
                <p className='pending-list__createdAt'>Pending since: {sinceDate} {sinceTime}</p>
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
                <div className='discussion'>Discussion goes here.</div>
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
