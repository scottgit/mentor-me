import React, {useState, useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {NavLink, useLocation, useHistory} from 'react-router-dom';
import {fetch} from '../../store/csrf';
import DiscussionNav from '../Includes/DiscussionNav';
import DiscussionView from '../Includes/DiscussionView';
import NewDiscussion from '../Includes/NewDiscussion';

const Discussions = ({connectionId, type}) => {
  const location = useLocation();
  const sessionUserId = useSelector(state => state.session.user.id);
  const connections = useSelector(state => state.session.connections);
  const pendingCount = useSelector(state => state.session.counts.inviteCount + state.session.counts.requestCount);
  const [discussion, setDiscussion] = useState(null);
  const [collapsed, setCollapsed] = useState('');
  const history = useHistory();
  //Get Discussion
  const parsePath = location.pathname.split('/');
  const endpoint = parseInt(parsePath[parsePath.length - 1]);
  const endpointIsNumber = !isNaN(endpoint);
  if (endpointIsNumber) {
    connectionId = endpointIsNumber ? parseInt(parsePath[parsePath.length - 3]) : null;
  }

  // Validate path with ids
  const validIds = endpointIsNumber ? validatePathIds(connectionId, endpoint) : false;

  function validatePathIds(cId, dId) {
    if(!connections[cId]) return false;
    const arr = connections[cId].discussions;
    for(let i = 0; i < arr.length; i++) {
      if (arr[i].id === dId) return true;
    }
    return false;
  }

  // Set name
  let othersName = '';
  let othersRole = '';
  if (connectionId) {
    othersRole = connections[connectionId].userRole === 'mentor' ? 'mentee' : 'mentor';
    othersName = connections[connectionId][othersRole];
  }

  // Set Connection types
  const connectionsArray = Object.values(connections);
  const asMentor = useMemo(() => connectionsArray.filter(connection => {
    return (
      connection.userRole === 'mentor' && connection.status === 'established'
    )
  }), [connectionsArray] );
  const asMentee = useMemo(() => connectionsArray.filter(connection => {
    return (
      connection.userRole === 'mentee' && connection.status === 'established'
    )
  }), [connectionsArray] );

  useEffect(() => {
    //TODO Make 'cleanFetch' utility function to use in useEffects with async with cleanup code based off https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
    if(!validIds && !['discussions'].includes(endpoint)) {
      history.replace('/discussions');
      return null;
    }
    async function getDiscussion() {
      const res = await fetch(`/api/discussions/d/${endpoint}`);
      setDiscussion(res.data);
    }
    getDiscussion();

  }, [validIds, endpoint])

  const viewState = {
    discussion,
    othersName,
    yourId: sessionUserId,
    collapsed
  }

  return (
    <main className='page discussions-page'>
      <nav className='discussions-nav'>
        <NavLink className='button' to='/discussions'>
          New Discussion
        </NavLink>
        {validIds && <button type='button' className='button' onClick={() => collapsed ? setCollapsed('') : setCollapsed('collapse')}>{(collapsed ? 'Expand' : 'Collapse')} Posts</button>}
          {pendingCount !== 0 && <NavLink to='/pending' className='discussions-pending__link discussions-nav__link'>Go to Pending</NavLink>}
          {asMentor.length > 0 &&
          <div className='discussions-nav__role'>
            <h4 className='discussions-nav__role-heading'>With Your Mentees</h4>
            <DiscussionNav connections={asMentor} othersRole={'mentee'} />
          </div>}
          {asMentee.length > 0 &&
          <div className='discussions-nav__role'>
            <h4 className='discussions-nav__role-heading'>With Your Mentors</h4>
            <DiscussionNav connections={asMentee} othersRole={'mentor'}/>
          </div>}
      </nav>
      <section className={`discussions-view`}>

          {
            ( validIds &&
              <>
                <h2 className='discussions-heading'>Discussion with {othersName}</h2>
                <DiscussionView {...viewState}/>
              </>
            )
            ||
            (
              <>
              <h2 className='discussions-heading'>New Discussion</h2>
                <NewDiscussion />
              </>
            )
          }

      </section>
    </main>
  )
}

export default Discussions
