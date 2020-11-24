import { set } from 'js-cookie';
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
  await setFullUserInfo(res, dispatch);
  return res;
}

export const restoreSession = () => async (dispatch) => {
  const res = await fetch(
    '/api/session'
  );
  if(res.data.user) {
    await setFullUserInfo(res, dispatch);
  } else {
    dispatch(setUser(res.data.user, null, null));
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

const sessionReducer = (state = initialState, {type, user}) => {
  switch (type) {
    case SET_USER:
    case REMOVE_USER:
      return { ...state, user }
    default:
      return state
  }
}

export default sessionReducer;

async function setFullUserInfo(res, dispatch) {
  const id = res.data.user.id;
  const mentoring = await fetch(`/api/users/${id}/mentees`);
  const learning = await fetch(`/api/users/${id}/mentors`)
  dispatch(setUser(res.data.user, learning.data.mentors, mentoring.data.mentees));
}
