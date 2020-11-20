import React from 'react';
import {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../store/session';
import FormErrorList from '../Includes/FormErrorList';

const LoginFormPage = () => {
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  if (sessionUser) {
    return <Redirect to='/'/>
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
    <form className='session-form' onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <FormErrorList errors={errors} />
      <div className='session-form__input-wrapper'>
        <label className='session-form__label'>
          <div className='session-form__label-text'>Username or Email</div>
          <input
            type='text'
            value={credential}
            onChange={e => setCredential(e.target.value)}
            className='session-form__input'
          />
        </label>
        <label className='session-form__label'>
          <div className='session-form__label-text'>Password</div>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='session-form__input'
          />
        </label>
      </div>
      <button type='submit' className='button session-form__button'>Log In</button>
    </form>
  )
}

export default LoginFormPage
