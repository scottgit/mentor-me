import React from 'react';
import {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {useSelector} from 'react-redux';
import {fetch} from '../../store/csrf';

const PublicListing = () => {
  const [list, setList] = useState([]);
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();
  const segments = location.pathname.split('/');
  const endpoint = segments[segments.length - 1];
  const role = endpoint.slice(0,endpoint.length - 1);
  const connectType = role === 'mentee' ? 'Invite' : 'Request';
  const isMentor = sessionUser.mentorDesc !== '';
  const isMentee = sessionUser.menteeDesc !== '';


  useEffect(() => {
    async function getList() {
      const res = await fetch(`/api/users/public/${endpoint}`);
      setList(res.data[endpoint]);
    }
    getList();
  }, [endpoint]);

  return (
    <>
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
            const {id, username, goBy, picture, menteeDesc, mentorDesc} = person;
            return (
              <li key={id} className='public-list__list-item'>
                <h3 className='public-list__name'>{goBy || username}</h3>
                {person.picture && <img src={picture} alt={role + 'as' + username} className='public-list__img'/>}
                <p className='public-list__description'>{
                    (role === 'mentee' && menteeDesc) ||
                    (role === 'mentor' && mentorDesc)
                    }
                </p>
                { //Get type of connection button
                  ((
                    (role === 'mentee' && isMentor)
                    || (role === 'mentor' && isMentee)
                  )
                  &&
                      <button type='button' className='button public-list__button' value={id}>
                          {connectType} this {role}
                      </button>
                  )
                  || //OR, Current user cannot connect
                  <p className='public-list__no-connect-note'>
                    You cannot connect with this {role}.
                    {
                      (role === 'mentee' && 'Add a mentor description to activate yourself as a potential mentor to connect to this mentee.') ||
                      (role === 'mentor' && 'Add a mentee description to activate yourself as a potential mentee to connect with this mentor.')
                    }
                    </p>
                }
              </li>
            )
          })}
        </ul>
      }
    </>
  )
}

export default PublicListing
