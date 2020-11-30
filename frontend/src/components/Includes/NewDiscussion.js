import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {handleConnectionsChange} from '../../store/session';
import {fetch} from '../../store/csrf';
import { useHistory } from 'react-router-dom';

const NewDiscussion = ({connectionId, type, othersName}) => {
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
  const [conId, setConId] = useState(connectionId ? connectionId : '');
  const dispatch = useDispatch();

  useEffect(() => {}, [conId])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postValue === '' || discussionTitle === '') {
      alert('Title and post are required');
      return;
    }
    if (conId === '') {
      alert('A person to add a discussion to is needed.');
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
        `/api/discussions/c/${conId}`,
        { method: 'POST',
          body: JSON.stringify({title, stream})
        }
      );
      if(res.ok) {
        const dId = res.data.id;
        await dispatch(handleConnectionsChange(sessionUser));
        setDiscussionTitle('');
        setPostValue('');
        history.push(`/discussions/c/${conId}/d/${dId}`);
      } else {
        throw res;
      };
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='new-discussion__form page-form'>
        {(establishedConnections
          && !type
          &&
          <label className='new-discussion__label'>
            Select User to Have New Discussion With
            <select
            className='new-discussion__select'
            value={conId}
            required
            onChange={(e) => {
              setConId(e.target.value)
            }}
            >
              <option key={0} value='' disabled>Select a person...</option>
              {
                establishedConnections.map(c => {
                  return <option key={c.cId} value={c.cId}>{c.otherUser}</option>
                })
              }
            </select>
          </label>
          )
          ||
          ( connectionId
            && type === 'new'
            &&
            <h3>With {othersName}</h3>
          )
        }
        <label className='new-discussion__label'>
          Discussion Title
        <input className='new-discussion__title' type='text' value={discussionTitle} onChange={e => setDiscussionTitle(e.target.value)} required maxLength={50}/>
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
