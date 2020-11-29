import React, {useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {ModalContext} from './Modal';
import {fetch} from '../../store/csrf';
import { useHistory } from 'react-router-dom';

const NewDiscussion = ({connectionId, connectionInfo, requiredPendingTitle}) => {
  const history = useHistory();
  const sessionUserId = useSelector(state => state.session.user.id);
  const [postValue, setPostValue] = useState('');
  const [discussionTitle, setDiscussionTitle] = useState(requiredPendingTitle);
  const [streamUpdated, setStreamUpdated] = useState(0);
  const {setShowModal} = useContext(ModalContext);

  const makeNewConnection = async (connection) => {
    const res = await fetch(
      `/api/users/${connection.initiatorId}/pending`,
      { method: 'POST',
        body: JSON.stringify(connection)
      }
    );
    return res.data
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredPendingTitle && discussionTitle !== requiredPendingTitle) {
      setDiscussionTitle(requiredPendingTitle);
    }
    if (postValue === '' || discussionTitle === '') {
      alert(`${requiredPendingTitle ? 'A post is' : 'Title and post are'} required`);
      return;
    }
    if(!connectionId) {
      const connection = await makeNewConnection(connectionInfo);
      connectionId = connection.id;
    }

    const title = discussionTitle;
    const message = postValue;
    const postDate = new Date();
    const date = postDate.toLocaleDateString('en-Us');
    const time = postDate.toLocaleTimeString('en-Us');
    const userId = sessionUserId;
    const stream = [{userId, date, time, message}];

    try {
      const res = await fetch(
        `/api/discussions/c/${connectionId}`,
        { method: 'POST',
          body: JSON.stringify({title, stream})
        }
      );
      if(res.ok) {
        setStreamUpdated(streamUpdated + 1);
        setDiscussionTitle('');
        setPostValue('');
        setShowModal(false);
        history.push('/pending');
      } else {
        throw res;
      };
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='new-discussion__form'>
        <label className='new-discussion__label'>
          Discussion Title
        <input className='new-discussion__title' type='text' value={discussionTitle} onChange={e => setDiscussionTitle(e.target.value)} readOnly={requiredPendingTitle}/>
        </label>

        <label className='new-discussion__label'>
          Discussion Post
          {(
          requiredPendingTitle &&
          <p className='new-discussion__prompt'>Give a reason for your interest in connecting with this person.</p>
        )}
        <textarea value={postValue} onChange={e => setPostValue(e.target.value)} className='new-discussion__textarea'></textarea>
        </label>
        <div className='confirm-form__buttons'>
        <button className='button new-discussion-form__submit --warning' type='submit'>Post</button>
        <button className='button new-discussion__cancel' autoFocus type='button' onClick={() =>  setShowModal(false)}>Cancel</button>
      </div>
    </form>
  )
}

export default NewDiscussion
