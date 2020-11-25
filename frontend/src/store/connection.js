import {fetch} from './csrf';
import {reviveDates} from './utils';

const PENDING = "PENDING_CONNECTION";
const APPROVE = "APPROVE_CONNECTION";
const REJECT = "REJECT_CONNECTION";
const WITHDRAW = "WITHDRAW_CONNECTION";

const initialState = {
  userId: null,
  mentorId: null,
  initiatorId: null,
  status: null,
}

const initiateConnection = (connection) => {
  return ({
    type: PENDING,
    connection: {...connection, status: 'pending'}
  })
}

const approveConnection = (connection) => {
  return ({
    type: APPROVE,
    connection: {...connection, status: 'established'}
  })
}

const rejectConnection = (connection) => {
  return ({
    type: REJECT,
    connection: {...connection, status: 'rejected'}
  })
}

const withdrawConnection = (connection) => {
  return ({
    type: WITHDRAW,
    connection
  })
}

//Thunks
export const requestConnection = (connection) => async (dispatch) => {
  const res = await fetch(
    `/api/users/${connection.initiatorId}/pending`,
    { method: 'POST',
      body: JSON.stringify(connection)
    }
  );
  res.data.connection = reviveDates(res.data.connection);
  dispatch(initiateConnection(res.data.connection));
  return res;
}

export const establishConnection = (connection, id) => async (dispatch) => {


  const res = await fetch(
    `/api/users/${id}/accept`,
    { method: 'PATCH',
      body: JSON.stringify({id: connection.id, status: connection.status})
    }
  );
  res.data.connection = reviveDates(res.data.connection);
  dispatch(approveConnection(res.data.connection));
  return res;
}

export const denyConnection = (connection, id) => async (dispatch) => {

  const res = await fetch(
    `/api/users/${id}/accept`,
    { method: 'PATCH',
      body: JSON.stringify({id: connection.id, status: connection.status})
    }
  );
  res.data.connection = reviveDates(res.data.connection);
  dispatch(rejectConnection(res.data.connection));
  return res;
}


//End Thunks

const connectionReducer = (state = initialState, {type, connection}) => {
  switch (type) {
    case PENDING:
    case APPROVE:
    case REJECT:
    case WITHDRAW:
      return { ...state, connection }
    default:
      return state
  }
}

export default connectionReducer;
