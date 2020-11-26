// import { set } from 'js-cookie';
import { get } from 'js-cookie';
import {fetch} from './csrf';
import {reviveDates} from './utils'

const SET_USER = "SESSION_SET_USER";
const REMOVE_USER = "SESSION_REMOVE_USER";
const UPDATE_RELATIONS = "SESSION_UPDATE_RELATIONS";
const UPDATE_CONNECTIONS = "SESSION_UPDATE_CONNECTIONS";

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

const updateRelations = (mentors, mentees, invites, requests, counts) => {
  return ({
    type: UPDATE_RELATIONS,
    mentors,
    mentees,
    invites,
    requests,
    counts,
  })
}

const updateConnections = (connections) => {
  return ({
    type: UPDATE_CONNECTIONS,
    connections
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
  await dispatch(handleConnectionsChange(res.data.user));
  return res;
}

export const restoreSession = () => async (dispatch) => {
  const res = await fetch(
    '/api/session'
  );

  if(res.data.user) {
    res.data.user = reviveDates(res.data.user);
    await dispatch(setUser(res.data.user));
    await dispatch(handleConnectionsChange(res.data.user));
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

export const handleConnectionsChange = (user) => async (dispatch) => {
  let connections = await setUserConnections(user, dispatch);
  connections = await getBasicDiscussionsInfo(connections);
  dispatch(updateConnections(connections));
}


//End Thunks

const sessionReducer = (
  state = initialState,
  {type, user, mentors, mentees, invites, requests, counts, connections}
  ) => {
  switch (type) {
    case SET_USER:
      return { ...state, user};
    case REMOVE_USER:
      return { ...state, user, mentors, mentees, invites, requests, counts};
    case UPDATE_RELATIONS:
      return { ...state, mentors, mentees, invites, requests, counts};
    case UPDATE_CONNECTIONS:
        return { ...state, connections};
    default:
      return state;
  }
}

export default sessionReducer;



/***** HELPER FUNCTIONS *****/
async function setUserConnections(user, dispatch) {
  const userId = user.id;
  let menteeList = await fetch(`/api/users/${userId}/mentees`);
  let mentorList = await fetch(`/api/users/${userId}/mentors`);
  let inviteList = await fetch(`/api/users/${userId}/invites`);
  let requestList = await fetch(`/api/users/${userId}/requests`);
  let menteeCount = 0;
  let mentorCount = 0;
  let inviteCount = 0;
  let requestCount = 0;
  const connections = {};


  if(menteeList.data.mentees) {
    menteeList = menteeList.data.mentees.map(mentee => {
      const connectionId = mentee.Connections.id;
      connections[connectionId] = {
        connectionId,
        userRole: 'mentor',
        mentor: user.goBy || user.username,
        mentee: mentee.goBy || mentee.username,
        discussions:  [],
      }
      menteeCount++;
      return reviveDates(mentee);
    })
  }
  if(mentorList.data.mentors) {
    mentorList = mentorList.data.mentors.map(mentor => {
      const connectionId = mentor.Connections.id;
      connections[connectionId] = {
        connectionId,
        userRole: 'mentee',
        mentor: mentor.goBy || mentor.username,
        mentee: user.goBy || user.username,
        discussions:  [],
      }
      mentorCount++;
      return reviveDates(mentor);
    })
  }
  if(inviteList.data.invites) {
    inviteList = inviteList.data.invites.map(invite => {
      const connectionId = invite.Connections.id;
      connections[connectionId] = {
        connectionId,
        userRole: 'mentor',
        mentor: user.goBy || user.username,
        mentee: invite.goBy || invite.username,
        discussions:  [],
      }
      inviteCount++;
      return reviveDates(invite);
    })
  }
  if(requestList.data.requests) {
    requestList = requestList.data.requests.map(request => {
      const connectionId = request.Connections.id;
      connections[connectionId] = {
        connectionId,
        userRole: 'mentee',
        mentor: request.goBy || request.username,
        mentee: user.goBy || user.username,
        discussions:  [],
      }
      requestCount++;
      return reviveDates(request);
    })
  }

  const counts = {menteeCount, mentorCount, inviteCount, requestCount};

  dispatch(updateRelations(mentorList, menteeList, inviteList, requestList, counts));

  return connections;
}

async function getBasicDiscussionsInfo(connections) {

  for (let connectionId in connections) {
    const res = await fetch(
      `/api/discussions/c/${connectionId}/minimal`
    );
    connections[connectionId].discussions = res.data;
  }

  return connections;
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
