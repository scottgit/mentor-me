import React, {useState, useEffect} from 'react';
import {fetch} from '../../store/csrf';


const DiscussionView = ({discussion, yourId, othersName, collapsed, discussionId}) => {
  const [postValue, setPostValue] = useState('')
  const [streamUpdated, setStreamUpdated] = useState(0);
  const [discussionUpdated, setDiscussionUpdated] = useState(0);
  const [getDiscussion, setGetDiscussion] = useState(discussion);

  useEffect(() => {
    if (!discussion && discussionId && !discussionUpdated) {
      async function getDiscussion() {
        const res = await fetch(`/api/discussions/d/${discussionId}`);
        setGetDiscussion(res.data);
        setDiscussionUpdated(discussionUpdated + 1);
      }
      getDiscussion();
    }
  }, [streamUpdated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postValue === '') return;
    const message = postValue;
    const postDate = new Date();
    const date = postDate.toLocaleDateString('en-Us');
    const time = postDate.toLocaleTimeString('en-Us');
    const userId = yourId;
    stream.push({userId, date, time, message});

    try {
      const res = await fetch(
        `/api/discussions/d/${disId}/update-stream`,
        { method: 'PATCH',
          body: JSON.stringify(stream)
        }
      );
      if(res.ok) {
        setStreamUpdated(streamUpdated + 1);
        setPostValue('');
      } else {
        throw res;
      };
    } catch (err) {
      console.error(err);
    }
  }

  const toggleVisible = (e) => {
    const post = e.target.closest('.discussions-post');

    if (post.classList.contains('collapse')) {
      post.classList.remove('collapse');
    }
    else {
      post.classList.add('collapse');
    }
  }

  discussion = discussion ? discussion : getDiscussion;
  const {stream, id: disId} = discussion || {stream: null, id: null};

  return (
    discussion &&
    <>
      <h3 className='discussions-post__title'>Title: {discussion.title}</h3>
      {stream.map((post, idx) => {
        const name = yourId === post.userId ? 'You' : othersName;
        return (
          <div key={`${idx}`} className={`discussions-post ${collapsed}`}>
            <div className='dicussions-post__header' onClick={toggleVisible}>
              <div className='discussions-post__name'>
                {name}
              </div>
              <div className='discussions-post__time'>
                {post.date} {post.time}
              </div>
            </div>
            <div className='discussions-post__msg'>{post.message}</div>
          </div>
        )
      })}
      <form onSubmit={handleSubmit} className='discussions-form'>
        <div className='dicussions-post__header'>
          <div className='discussions-post__name'>
            Create New Post
          </div>
          <button type='submit' className='button discussions-post__button'>Post</button>
        </div>
        <textarea value={postValue} onChange={e => setPostValue(e.target.value)} className='discussions-post__textarea'></textarea>
      </form>
    </>
  )
}

export default DiscussionView
