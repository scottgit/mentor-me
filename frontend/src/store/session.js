import {fetch} from './csrf';

const SET_USER = "SESSION_SET_USER";
const REMOVE_USER = "SESSION_REMOVE_USER";

const initialState = {
  user: null;
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
  type: SET_USER,
  user
}

const removeUser = () => {
  type: REMOVE_USER
}

export const logIn = ({ credential, password }) => async dispatch => {
  const res = await fetch(
    '/api/session',
    { method: 'POST',
      body: JSON.stringify({credential, password})
    }
  );
  dispatch(setUser(res.data));

}

const sessionReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case typeName:
    return { ...state, ...payload }

  default:
    return state
  }
}

export default sessionReducer;
