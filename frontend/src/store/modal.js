import Modal from "../components/Includes/Modal";

const SHOW_MODAL = "MODAL_SHOW_MODAL";
const HIDE_MODAL = "MODAL_HIDE_MODAL";

const initialState = {
  showModal: false
}

const showModal = () => {
  return ({
    type: SHOW_MODAL,
    showModal: true
  })
}

const hideModal = () => {
  return ({
    type: HIDE_MODAL,
    showModal: false
  })
}

export const displayModal = ({Component, message}) => async (dispatch) => {
  dispatch(showModal());
  return (
    <Modal Component={Component} message={message}/>
  )
}

const modalReducer = (state = initialState, {type, showModal}) => {
  switch (type) {
    case SHOW_MODAL:
    case HIDE_MODAL:
      return { ...state, showModal }
    default:
      return state
  }
}

export default modalReducer
