import React from 'react';
import {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {signup} from '../../store/session';
import FormErrorList from '../FormErrorList';

const SignupFormPage = () => {
  const sessionUser = useSelector(state => state.session.user);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  if (sessionUser) {
    return <Redirect to='/'/>
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]); //Clear any prior errors
    return dispatch(signup({ username, email, password }))
      .catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  }

  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <FormErrorList errors={errors} />
      <div className='login-form__input-wrapper'>
        <label className='login-form__label'>
          <div className='login-form__label-text'>Username</div>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            className='login-form__input'
          />
        </label>
        <label className='login-form__label'>
          <div className='login-form__label-text'>Email</div>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
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
      <button type='submit' className='button login-form__button'>Sign Up</button>
    </form>
  )
}

export default SignupFormPage
