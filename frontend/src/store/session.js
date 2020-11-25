// import { set } from 'js-cookie';
import {fetch} from './csrf';
import {reviveDates} from './utils'

const SET_USER = "SESSION_SET_USER";
const REMOVE_USER = "SESSION_REMOVE_USER";

const initialState = {
  user: null,
  mentors: null,
  mentees: null,
  invites: null,
  requests: null,
}

const setUser = (user, mentors, mentees, invites, requests) => {
  return ({
    type: SET_USER,
    user,
    mentors,
    mentees,
    invites,
    requests,
  })
}

const removeUser = () => {
  return ({
    type: REMOVE_USER,
    user: null,
    mentors: null,
    mentees: null,
    invites: null,
    requests: null,
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
  dispatch(setUser(res.data.user, null, null, null, null));
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
    dispatch(setUser(null, null, null, null, null));
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

const sessionReducer = (state = initialState, {type, user, mentors, mentees, invites, requests}) => {
  switch (type) {
    case SET_USER:
    case REMOVE_USER:
      return { ...state, user, mentors, mentees, invites, requests }
    default:
      return state
  }
}

export default sessionReducer;




async function setFullUserInfo(user, dispatch) {
  const id = user.id;
  let menteeList = await fetch(`/api/users/${id}/mentees`);
  let mentorList = await fetch(`/api/users/${id}/mentors`);
  let inviteList = await fetch(`/api/users/${id}/invites`);
  let requestList = await fetch(`/api/users/${id}/requests`);

  if(menteeList.data.mentees) {
    menteeList = menteeList.data.mentees.map(mentee => {
      return reviveDates(mentee);
    })
  }
  if(mentorList.data.mentors) {
    mentorList = mentorList.data.mentors.map(mentor => {
      return reviveDates(mentor);
    })
  }
  if(inviteList.data.invites) {
    inviteList = inviteList.data.invites.map(invite => {
      return reviveDates(invite);
    })
  }
  if(requestList.data.requests) {
    requestList = requestList.data.requests.map(request => {
      return reviveDates(request);
    })
  }

  dispatch(setUser(user, mentorList, menteeList, inviteList, requestList));
}
