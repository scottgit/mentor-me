import React from 'react';
import {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import {fetch} from './csrf';

const PublicListing = (props) => {
  const [list, setList] = useState([]);
  const location = useLocation();
  const endpoint = location.
  const role = endpoint.slice(0,endpoint.length - 1);
  const connect = role === 'mentee' ? 'Invite' : 'Request';

  useEffect(() => {
    async function getList() {
      const res = await fetch(`/api/users/public/${endpoint}`);
      setList(res);
    }
    getList();
  }, [endpoint]);


  return (
    <>
      <h2>Public {endpoint.char[0].toUpperCase() + endpoint.splice(1)}</h2>
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
                <button type='button' className='button' value={id}>
                    {connect} {role}
                </button>
              </li>
            )
          })}
        </ul>
      }
    </>
  )
}

export default PublicListing
