import React, {useState, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {handleConnectionsChange} from '../../store/session';
import {fetch} from '../../store/csrf';
import { useHistory } from 'react-router-dom';

const NewDiscussion = ({connectionId, type}) => {
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const establishedConnections = useSelector(state => {
    return Object.values(state.session.connections).reduce((est, c) => {
      const role = c.userRole === 'mentor' ? 'mentee' : 'mentor';
      const info = {cId: c.connectionId, otherUser: c[role] };
      if (c.status === 'established') est.push({...info})
      return est;
    }, [])
  });
  const sessionUserId = sessionUser.id;
  const [postValue, setPostValue] = useState('');
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [connection, setConnection] = useState(connectionId);
  const [streamUpdated, setStreamUpdated] = useState(0);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postValue === '' || discussionTitle === '') {
      alert('Title and post are required');
      return;
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
        await dispatch(handleConnectionsChange(sessionUser));
        setStreamUpdated(streamUpdated + 1);
        setDiscussionTitle('');
        setPostValue('');
        history.push('/pending');
      } else {
        throw res;
      };
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='new-discussion__form page-form'>
        {establishedConnections &&
          <label className='new-discussion__label'>
            Select User to Have New Discussion With
            <select id='other-user' className='new-discussion__select' placeholder='Select a name' required>
              <option key={0} value='' disabled selected>Select a person...</option>
              {
                establishedConnections.map(c => {
                  return <option key={c.cId} value={c.cId}>{c.otherUser}</option>
                })
              }
            </select>
          </label>
        }
        <label className='new-discussion__label'>
          Discussion Title
        <input className='new-discussion__title' type='text' value={discussionTitle} onChange={e => setDiscussionTitle(e.target.value)} required/>
        </label>

        <label className='new-discussion__label'>
          Discussion Post
        <textarea value={postValue} onChange={e => setPostValue(e.target.value)} className='new-discussion__textarea' required></textarea>
        </label>
        <div className='new-discussion__buttons'>
          <p className='new-discussion__post-warning'>Reminder: New discussions and posts cannot be deleted, so be sure you want to make a new discussion stream.</p>
          <button className='button new-discussion-form__submit --warning' type='submit'>Post</button>
        </div>
    </form>
  )
}

export default NewDiscussion
