// import { set } from 'js-cookie';
import {fetch} from './csrf';
import {reviveDates} from './utils'

const SET_USER = "SESSION_SET_USER";
const REMOVE_USER = "SESSION_REMOVE_USER";
const UPDATE_CONNECTIONS = "SESSION_UPDATE_CONNECTIONS"

const initialState = resetUser();

const setUser = (user) => {
  return ({
    type: SET_USER,
    user,
  })
}

const removeUser = () => {
  return { type: REMOVE_USER, ...resetUser()}
}

const updateConnections = (mentors, mentees, invites, requests, counts) => {
  return ({
    type: UPDATE_CONNECTIONS,
    mentors,
    mentees,
    invites,
    requests,
    counts,
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
  dispatch(setUser(res.data.user));
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
  await dispatch(setUser(res.data.user));
  await setUserConnections(res.data.user.id, dispatch);
  return res;
}

export const restoreSession = () => async (dispatch) => {
  const res = await fetch(
    '/api/session'
  );

  if(res.data.user) {
    res.data.user = reviveDates(res.data.user);
    await dispatch(setUser(res.data.user));
    await setUserConnections(res.data.user.id, dispatch);
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

export const handleConnectionsChange = (userId) => async (dispatch) => {
  setUserConnections(userId, dispatch);
}
//End Thunks

const sessionReducer = (
  state = initialState,
  {type, user, mentors, mentees, invites, requests, counts}
  ) => {
  switch (type) {
    case SET_USER:
      return { ...state, user};
    case REMOVE_USER:
      return { ...state, user, mentors, mentees, invites, requests, counts};
    case UPDATE_CONNECTIONS:
      return { ...state, mentors, mentees, invites, requests, counts};
    default:
      return state;
  }
}

export default sessionReducer;



/***** HELPER FUNCTIONS *****/
async function setUserConnections(userId, dispatch) {
  let menteeList = await fetch(`/api/users/${userId}/mentees`);
  let mentorList = await fetch(`/api/users/${userId}/mentors`);
  let inviteList = await fetch(`/api/users/${userId}/invites`);
  let requestList = await fetch(`/api/users/${userId}/requests`);
  let menteeCount = 0;
  let mentorCount = 0;
  let inviteCount = 0;
  let requestCount = 0;

  if(menteeList.data.mentees) {
    menteeList = menteeList.data.mentees.map(mentee => {
      menteeCount++;
      return reviveDates(mentee);
    })
  }
  if(mentorList.data.mentors) {
    mentorList = mentorList.data.mentors.map(mentor => {
      mentorCount++;
      return reviveDates(mentor);
    })
  }
  if(inviteList.data.invites) {
    inviteList = inviteList.data.invites.map(invite => {
      inviteCount++;
      return reviveDates(invite);
    })
  }
  if(requestList.data.requests) {
    requestList = requestList.data.requests.map(request => {
      requestCount++;
      return reviveDates(request);
    })
  }

  const counts = {menteeCount, mentorCount, inviteCount, requestCount}

  dispatch(updateConnections(mentorList, menteeList, inviteList, requestList, counts));
}

function resetCounts() {
  return {menteeCount: 0, mentorCount: 0, inviteCount: 0, requestCount: 0}
}

function resetUser() {
  return {
    user: null,
    mentors: null,
    mentees: null,
    invites: null,
    requests: null,
    counts: resetCounts(),
  }
}
