import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {fetch} from '../../store/csrf';
import DiscussionNav from '../Includes/DiscussionNav';
import DiscussionView from '../Includes/DiscussionView';

const Discussions = ({discussionId}) => {
  const sessionUserId = useSelector(state => state.session.user.id);
  const connections = useSelector(state => Object.values(state.session.connections));
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);
  const [viewId, setViewId] = useState(discussionId);
  const [otherName, setOtherName] = useState(null);
  const [discussion, setDiscussion] = useState(null);

  const asMentor = connections.filter(connection => connection.userRole === 'mentor' && connection.status === 'established');
  const asMentee = connections.filter(connection => connection.userRole === 'mentee' && connection.status === 'established');

  useEffect(() => {
    //TODO Make 'cleanFetch' utility function to use in useEffects with async with cleanup code based off https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
    if (!viewId) return;

    async function getDiscussion() {
      const res = await fetch(`/api/discussions/d/${viewId}`);
      setDiscussion(res.data);
    }
    getDiscussion();
  }, [viewId])

  return (
    <div className='page discussions-page'>
      <nav className='discussions-nav'>
          {pendingCount !== 0 && <NavLink to='/pending' className='discussions-pending__link'>Go to Pending</NavLink>}
          {asMentor.length > 0 &&
          <div className='discussions-nav__role'>
            <h4 className='discussions-nav__role-heading'>With Your Mentees</h4>
            <DiscussionNav connections={asMentor} setViewId={setViewId} setOtherName={setOtherName} othersRole={'mentee'} />
          </div>}
          {asMentee.length > 0 &&
          <div className='discussions-nav__role'>
            <h4 className='discussions-nav__role-heading'>With Your Mentors</h4>
            <DiscussionNav connections={asMentee} setViewId={setViewId} setOtherName={setOtherName} othersRole={'mentor'}/>
          </div>}
      </nav>
      <section className='discussions-view'>
          <h2 className='discussions-heading'>
            Discussion {(viewId ? `with ${otherName}` : '')}
          </h2>
          <DiscussionView discussion={discussion} otherName={otherName} yourId={sessionUserId}/>

      </section>
    </div>
  )
}

export default Discussions
