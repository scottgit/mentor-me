import React, {useState} from 'react';
import {fetch} from '../../store/csrf';


const DiscussionView = ({discussion, yourId, otherName}) => {
  const [postValue, setPostValue] = useState('')
  const {stream, id: disId} = discussion || {stream: null, id: null};


  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      alert('Post failed to save.');
      console.error(err);
    }
    //TODO Refresh correctly
  }

  return (
    discussion &&
    <>
      <h3 className='discussions-post__title'>Title: {discussion.title}</h3>
      {stream.map((post, idx) => {
        const name = yourId === post.userId ? 'You' : otherName;
        return (
          <div key={`${idx}`} className='discussions-post'>
            <div className='dicussions-post__header'>
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
