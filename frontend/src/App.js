import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import {restoreSession} from './store/session';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(()=> {
    dispatch(restoreSession()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <Switch>
      <Route path='/' exact>
        <h1>Home page</h1>
      </Route>
      <Route path='/login' component={LoginFormPage}/>
      <Route path='/signup' component={SignupFormPage}/>
    </Switch>
  );

}

export default App;
