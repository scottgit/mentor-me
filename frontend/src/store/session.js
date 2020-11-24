// import { set } from 'js-cookie';
import {fetch} from './csrf';

const SET_USER = "SESSION_SET_USER";
const REMOVE_USER = "SESSION_REMOVE_USER";

const initialState = {
  user: null
}

const setUser = (user, mentors, mentees) => {
  return ({
    type: SET_USER,
    user,
    mentors,
    mentees,
  })
}

const removeUser = () => {
  return ({
    type: REMOVE_USER,
    user: null,
    mentors: null,
    mentees: null,
  })
}

//Thunks
export const signup = (user) => async (dispatch) => {
  const res = await fetch(
    '/api/users',
    { method: 'POST',
      body: JSON.stringify({...user})
    }
  );
  res.data.user = reviveDates(res.data.user);
  dispatch(setUser(res.data.user, null, null));
  return res;
}

export const login = ({ credential, password }) => async (dispatch) => {
  const res = await fetch(
    '/api/session',
    { method: 'POST',
      body: JSON.stringify({credential, password})
    }
  );
  res.data.user = reviveDates(res.data.user);
  await setFullUserInfo(res.data.user, dispatch);
  return res;
}

export const restoreSession = () => async (dispatch) => {
  const res = await fetch(
    '/api/session'
  );

  if(res.data.user) {
    res.data.user = reviveDates(res.data.user);
    await setFullUserInfo(res.data.user, dispatch);
  } else {
    dispatch(setUser(null, null, null));
  }
  return res;
}

export const logout = () => async (dispatch) => {
  const res = await fetch(
    '/api/session',
    {
      method: 'DELETE'
    }
  );
  dispatch(removeUser());
  return res;
}
//End Thunks

const sessionReducer = (state = initialState, {type, user, mentors, mentees}) => {
  switch (type) {
    case SET_USER:
    case REMOVE_USER:
      return { ...state, user, mentors, mentees }
    default:
      return state
  }
}

export default sessionReducer;




async function setFullUserInfo(user, dispatch) {
  const id = user.id;
  let menteeList = await fetch(`/api/users/${id}/mentees`);
  let mentorList = await fetch(`/api/users/${id}/mentors`);

  menteeList = menteeList.data.mentees.map(mentee => {
    return reviveDates(mentee);
  })
  mentorList = mentorList.data.mentors.map(mentor => {
    return reviveDates(mentor);
  })

  dispatch(setUser(user, mentorList, menteeList));
}

function reviveDates (user) {
  if (user.createdAt) {
    user = {...user, createdAt: new Date(user.createdAt).toLocaleDateString()}
  }
  if (user.updatedAt) {
    user = {...user, updatedAt: new Date(user.updatedAt).toLocaleDateString()}
  }
  return user;
}
