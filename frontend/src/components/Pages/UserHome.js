import React from 'react';
import {useSelector} from 'react-redux';

const UserHome = () => {
  const sessionUser = useSelector(state => state.session.user);
  return (
    <h2>Welcome</h2>
  )
}

export default UserHome
