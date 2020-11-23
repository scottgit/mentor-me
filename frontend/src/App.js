import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import Navigation from './components/Navigation';
import Signup from './components/Pages/Signup';
import UserHome from './components/Pages/UserHome';
import Welcome from './components/Pages/Welcome';
import {restoreSession} from './store/session';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(()=> {
    dispatch(restoreSession()).then(() => setIsLoaded(true));
  }, [dispatch]);



  return isLoaded && (
    <main className='main'>
      <Navigation />
      <Switch>
        <Route path='/' exact>
          {
            (sessionUser && <UserHome/>) || <Welcome />
          }
        </Route>
        <Route path='/signup' exact>
          <Signup />
        </Route>
      </Switch>
    </main>
  );

}

export default App;
