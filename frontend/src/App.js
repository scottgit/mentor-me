import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';
import Navigation from './components/Navigation';
import NotFound from './components/Pages/NotFound';
import PublicListing from './components/Pages/PublicListing';
import Signup from './components/Pages/Signup';
import UserHome from './components/Pages/UserHome';
import Welcome from './components/Pages/Welcome';
import Pending from './components/Pages/Pending';
import {restoreSession} from './store/session';
import Discussions from './components/Pages/Discussions';
import About from './components/Includes/About';
import ModalTrigger from './components/Includes/ModalTrigger';
import UserProfile from './components/Pages/UserProfile';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(()=> {
    dispatch(restoreSession()).then(() => setIsLoaded(true));
  }, [dispatch]);



  return isLoaded && (
    <>
      <div className='main'>
        <Navigation />
        <Switch>
          <Route path='/' exact>
            {(sessionUser && <UserHome/>) || <Welcome />}
          </Route>
          <Route exact path={['/public/mentors', '/public/mentees']}>
            {(sessionUser &&  <PublicListing />) || <Redirect to="/" />}
          </Route>
          <Route path='/signup' exact>
            {(!sessionUser &&  <Signup />) || <Redirect to="/" />}
          </Route>
          <Route path='/pending' exact>
            {(sessionUser &&  <Pending />) || <Redirect to="/" />}
          </Route>
          <Route path='/profile' >
            {(sessionUser &&  <UserProfile />) || <Redirect to="/" />}
          </Route>
          <Route path={['/discussions','/discussions/c/:cId(\\d+)/d/:dId(\\d+)']} exact render={(props) =>
            {return (sessionUser &&  <Discussions {...props} />) || <Redirect to="/" />}
          }/>
          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
        <footer className='footer'>
          <ModalTrigger triggerComponent={<div className='footer__about'>About</div>}>
            <About />
          </ModalTrigger>
          <div className='footer__copyright'>&copy; 2021</div>
        </footer>
      </div>

    </>
  );

}

export default App;
