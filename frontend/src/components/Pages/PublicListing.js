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
        list &&
        <ul>
          {list.map(person => {
            const {id, username, goBy, picture, menteeDesc, mentorDesc} = person;
            return (
              <li key={id}>
                <h3>{goBy || username}</h3>
                {person.picture && <img src={picture} alt={role + 'as' + username} />}
                <p>{
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
                      <button type='button' className='button' value={id}>
                          {connectType} this {role}
                      </button>
                  )
                  || //OR, Current user cannot connect
                  <p>
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
