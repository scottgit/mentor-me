import React from 'react';
import {NavLink} from 'react-router-dom';

const Welcome = () => {
  return (
    <div className='page'>
      <h2>Welcome to Mentor Me</h2>
      <p>Mentor Me is a place to find or be a mentor.</p>
      <p>Do you have skills or experience in an area and seek to guide others in gaining those skills? Then maybe you want to become a mentor.</p>
      <p>Do you need guidance, structure, and motivation to achieve your goals? Then maybe you need to be mentored.</p>
      <p>Whichever is your desire (or both), <NavLink to='/signup'>signup</NavLink> and start seeking to make a connection as a Mentor or Mentee today.</p>
    </div>
  )
}

export default Welcome
