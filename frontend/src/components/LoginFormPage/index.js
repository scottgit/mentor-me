import React from 'react';
import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../store/session';
import FormErrorList from '../FormErrorList';

const LoginFormPage = () => {
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  if (sessionUser) {
    //return <Redirect to='/'/>
    history.replace('/');
    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]); //Clear any prior errors
    return dispatch(login({ credential, password }))
      .catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  }

  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <FormErrorList errors={errors} />
      <div className='login-form__input-wrapper'>
        <label className='login-form__label'>
          <div className='login-form__label-text'>Username or Email</div>
          <input
            type='text'
            value={credential}
            onChange={e => setCredential(e.target.value)}
            className='login-form__input'
          />
        </label>
        <label className='login-form__label'>
          <div className='login-form__label-text'>Password</div>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='login-form__input'
          />
        </label>
      </div>
      <button type='submit' className='button login-form__button'>Log In</button>
    </form>
  )
}

export default LoginFormPage
