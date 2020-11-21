import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import Navigation from './components/Navigation';
import {restoreSession} from './store/session';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(()=> {
    dispatch(restoreSession()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return isLoaded && (
    <div className='page'>
      <Navigation />
      <Switch>
        <Route path='/' exact>
          <h1>Home page</h1>
        </Route>
      </Switch>
    </div>
  );

}

export default App;
