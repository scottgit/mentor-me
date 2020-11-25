import {fetch} from './csrf';
import {reviveDates} from './utils';

//TODO REMOVE UNEEDED REDUCER (i.e. this whole file is not needed)
const PENDING = "PENDING_CONNECTION";
const APPROVE = "APPROVE_CONNECTION";
const REJECT = "REJECT_CONNECTION";
const WITHDRAW = "WITHDRAW_CONNECTION";

const initialState = resetConnection();

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

const withdrawConnection = () => {
  return ({
    type: WITHDRAW,
    connection: resetConnection()
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

export const establishConnection = (userId, connectionId) => async (dispatch) => {
  const res = await fetch(
    `/api/users/${userId}/status`,
    { method: 'PATCH',
      body: JSON.stringify({id: connectionId, status: 'established'})
    }
  );
  res.data.connection = reviveDates(res.data.connection);
  dispatch(approveConnection(res.data.connection));
  return res;
}

export const declineConnection = (userId, connectionId) => async (dispatch) => {
  const res = await fetch(
    `/api/users/${userId}/status`,
    { method: 'PATCH',
      body: JSON.stringify({id: connectionId, status: 'rejected'})
    }
  );
  res.data.connection = reviveDates(res.data.connection);
  dispatch(rejectConnection(res.data.connection));
  return res;
}

export const deleteConnection = (userId, connectionId) => async (dispatch) => {
  const res = await fetch(
    `/api/users/${userId}/withdraw`,
    { method: 'DELETE',
      body: JSON.stringify({id: connectionId})
    }
  );
  if(res.data.success) {
    dispatch(withdrawConnection());
  } else {
    res.errors = ['Withdraw of request failed'];
  }

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


function resetConnection() {
  return {
    userId: null,
    mentorId: null,
    initiatorId: null,
    status: null,
  }
}
