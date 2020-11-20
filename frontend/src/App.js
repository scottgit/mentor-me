import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import {restoreSession} from './store/session';


function App() {
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(restoreSession());
  }, []);

  return (
    <Switch>
      <Route path='/' exact>Home page</Route>
      <Route path='/login' component={LoginFormPage}/>
    </Switch>
  );
}

export default App;
