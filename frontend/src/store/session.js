import {fetch} from './csrf';

const SET_USER = "SESSION_SET_USER";
const REMOVE_USER = "SESSION_REMOVE_USER";

const initialState = {
  user: null
}
/* User model
user: {
    id,
    email,
    username,
    createdAt,
    updatedAt
  }
*/
const setUser = (user) => {
  return ({
    type: SET_USER,
    user
  })
}

const removeUser = () => {
  return ({
    type: REMOVE_USER,
    user: null
  })
}

//Thunks
export const signup = ({ username, email, password }) => async (dispatch) => {
  const res = await fetch(
    '/api/users',
    { method: 'POST',
      body: JSON.stringify({ username, email, password })
    }
  );
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
  dispatch(setUser(res.data.user));
  return res;
}

export const restoreSession = () => async (dispatch) => {
  const res = await fetch(
    '/api/session'
  );
  dispatch(setUser(res.data.user));
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

