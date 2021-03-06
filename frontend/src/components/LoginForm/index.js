import React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../../store/session';
import FormErrorList from '../Includes/FormErrorList';

const LoginForm = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]); //Clear any prior errors
    return dispatch(login({ credential, password }))
      .catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  }

  const loginDemo = async (e) => {
    await setCredential('Demo-Me');
    await setPassword('password');
    document.getElementById('nav-login').click();
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
      <button id='nav-login' type='submit' className='button login-form__button'>Log In</button>
      <button type='button' className='button login-form__button' onClick={loginDemo}>Log In as Demo User</button>
    </form>
  )
}

export default LoginForm
