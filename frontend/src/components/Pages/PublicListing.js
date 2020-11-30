import React from 'react';
import {useEffect, useState} from 'react';
import { useLocation, Redirect, NavLink } from 'react-router-dom';
import {useSelector} from 'react-redux';
import {fetch} from '../../store/csrf';
import NewDiscussionModal from '../Includes/NewDiscussionModal';
import ModalTrigger from '../Includes/ModalTrigger';

const PublicListing = () => {
  //TODO get refresh to go to pending page on invite
  //TODO handle display of people that have pending connections with user
  const [list, setList] = useState([]);
  const sessionUser = useSelector(state => state.session.user);
  const userMentees = useSelector(state => state.session.mentees);
  const userMentors = useSelector(state => state.session.mentors);
  const pendingIds = useSelector(state => {
    return [...state.session.invites, ...state.session.requests].map(person => person.id)
  });
  const location = useLocation();
  const segments = location.pathname.split('/');
  const endpoint = segments[segments.length - 1];
  const role = endpoint.slice(0,endpoint.length - 1);
  const solicitation = role === 'mentee' ? 'Invite' : 'Request';

  useEffect(() => {
    if(!sessionUser) return;
    async function getList() {
      const res = await fetch(`/api/users/public/${endpoint}`);
      setList(res.data[endpoint]);
    }
    getList();
  }, [endpoint, sessionUser]);

  if (!sessionUser) {
    return <Redirect to='/'/>
  }
  const isMentor = sessionUser.mentorDesc !== '';
  const isMentee = sessionUser.menteeDesc !== '';
  let userMenteeIds = [];
  let userMentorIds = [];
  if(userMentees.length) {
    userMenteeIds = userMentees.map(mentee => mentee.id);
  }
  if(userMentors.length) {
    userMentorIds = userMentors.map(mentor => mentor.id);
  }






  return (
    <main className='page'>
      <h2>Public {endpoint[0].toUpperCase() + endpoint.slice(1)}</h2>
      {
        (role === 'mentee' && isMentor &&
         <p>Here is a listing of people seeking a mentor. Perhaps your area of skill or expertise might meet one or more of these seeker's needs. If you think so, send an Invite to make a connection.</p>
        )
        ||
        (role === 'mentor' && isMentee &&
        <p>Here is a listing of people who want to mentor others. Perhaps your area of need may be what they have to offer. If you think so, send a Request to make a connection.</p>
        )
        ||
        (role === 'mentee' && !isMentor &&
        <p>This is a listing of people seeking a mentor. You are not currently able to be a mentor, so if you find someone you think you can help, then add a mentor description to your profile in order to be able to make a connection.</p>
        )
        ||
        (role === 'mentor' && !isMentee &&
        <p>This is a listing of people who want to mentor others. You are noat currently able to be a mentee, so if you find someone you think can help you grow in an area, then add a mentee description to your profile in order to be able to make a connection.</p>
        )

      }
      {
        list &&
        <ul className='public-list__list'>
          {list.map(person => {
            const {id, username, goBy, picture, menteeDesc, mentorDesc, gender} = person;
            const self = id === sessionUser.id;
            const isPending = pendingIds.includes(id);
            let isUsersConnection;
            if(role === 'mentee') {
              isUsersConnection = userMenteeIds.indexOf(id) > -1;
            } else {
              isUsersConnection = userMentorIds.indexOf(id) > -1;
            }
            const connectionInfo = {
              status: 'pending',
              mentorId: (role === 'mentee' ? sessionUser.id : id),
              userId: (role === 'mentee' ? id : sessionUser.id),
              initiatorId: sessionUser.id,
            }
            return (
              <li key={id} className={`public-list__list-item ${isUsersConnection || isPending ? 'connected' :''}`}>
                <h3 className='public-list__name'>{goBy || username} {self ? '(You)' : ''} <span className='public-list__gender'>Gender identification: {gender}</span></h3>
                {picture && <img src={picture} alt={username + ' as ' + role} className='public-list__img'/>}
                <p className='public-list__description'>{
                    (role === 'mentee' && menteeDesc) ||
                    (role === 'mentor' && mentorDesc)
                    }
                </p>
                { //Get type of connection button
                  (
                    (
                      ((role === 'mentee' && isMentor)
                      || (role === 'mentor' && isMentee))
                      && !self && !isUsersConnection && !isPending
                    )
                  &&
                    <ModalTrigger buttonClasses='button public-list__button' buttonText={`${solicitation} this ${role}`}>
                        <NewDiscussionModal connectionInfo={connectionInfo} requiredPendingTitle='Interest to connect'/>
                    </ModalTrigger>
                  )
                  || //OR, Current user cannot connect
                  (!self && (
                      (isUsersConnection &&
                      <p className='connection-message'>You are already connected to this {role}.</p>
                      )
                      ||
                      (isPending &&
                        <p className='connection-message'>You have a <NavLink to='/pending'>pending connection</NavLink> with this {role}.</p>
                        )
                      ||
                      (<>
                        <p className='public-list__no-connect'>
                          You cannot connect with this {role}.
                        </p>
                        <p className='public-list__no-connect-note'>
                        {
                          (role === 'mentee' && 'Add a mentor description to activate yourself as a potential mentor to connect to this mentee.') ||
                          (role === 'mentor' && 'Add a mentee description to activate yourself as a potential mentee to connect with this mentor.')
                        } </p>
                      </>)
                    )
                  )
                }
              </li>
            )
          })}
        </ul>
      }
    </main>
  )
}

export default PublicListing
