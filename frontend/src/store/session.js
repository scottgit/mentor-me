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
    type: REMOVE_USER
  })
}

//Thunks
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
//End Thunks

const sessionReducer = (state = initialState, {type, user}) => {
  switch (type) {
    case SET_USER:
      return { ...state, user }
    case REMOVE_USER:
      return { ...state, user: null}
    default:
      return state
  }
}

export default sessionReducer;
//{credential: 'Demo-lition', password: 'password'}
