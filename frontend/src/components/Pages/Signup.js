import React from 'react';
import {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {signup} from '../../store/session';
import FormErrorList from '../Includes/FormErrorList';

const Signup = () => {

  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    goBy: '',
    picture: '',
    gender: '',
    mentorDesc: '',
    mentorIsPublic: false,
    menteeDesc: '',
    menteeIsPublic: false
  });

  const {
    email,
    username,
    password,
    confirmPassword,
    goBy,
    picture,
    gender,
    mentorDesc,
    mentorIsPublic,
    menteeDesc,
    menteeIsPublic
  } = user;


  if (sessionUser) {
    return <Redirect to='/'/>
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]); //Clear any prior errors
    return dispatch(signup(user)).catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  }

  const setUserProp = (keyValPair) => {
    return setUser({...user, ...keyValPair})
  }

  return (
    <main className='page'>
    <h2>Sign Up</h2>
    <p>* indicates required fields</p>
    <form className='signup-form' onSubmit={handleSubmit}>
      <FormErrorList errors={errors} />
      <div className='signup-form__input-wrapper'>
        <label className='signup-form__label'>
          <div className='signup-form__label-text'>Username*</div>
          <input
            type='text'
            value={username}
            onChange={e => setUserProp({username: e.target.value})}
            className='signup-form__input'
            minLength={4}
          />
        </label>
        <label className='signup-form__label'>
          <div className='signup-form__label-text'>Email*</div>
          <input
            type='email'
            value={email}
            onChange={e => setUserProp({email: e.target.value})}
            className='signup-form__input'
          />
        </label>
        <label className='signup-form__label'>
          <div className='signup-form__label-text'>Password*</div>
          <input
            type='password'
            value={password}
            onChange={e => setUserProp({password: e.target.value})}
            className='signup-form__input'
            //minLength={8}
          />
        </label>
        <label className='signup-form__label'>
          <div className='signup-form__label-text'>Confirm Password*</div>
          <input
            type='password'
            value={confirmPassword}
            onChange={e => setUserProp({confirmPassword: e.target.value})}
            className='signup-form__input'
            //minLength={8}
          />
        </label>
        <label className='signup-form__label'>
          <div className='signup-form__label-text'>Name you go by</div>
          <input
            type='text'
            value={goBy}
            onChange={e => setUserProp({goBy: e.target.value})}
            className='signup-form__input'
            placeholder='(optional)'
            //minLength={8}
          />
        </label>
        <label className='signup-form__label'>
          <div className='signup-form__label-text'>URL to your picture</div>
          <input
            type='text'
            value={picture}
            onChange={e => setUserProp({picture: e.target.value})}
            className='signup-form__input'
            placeholder='(optional)'
            //minLength={8}
          />
        </label>
        <div className='signup-form__label'>
          <div className='signup-form__label-text'>Gender*</div>
          <fieldset className='signup-form__radio-group' onChange={e => setUserProp({gender: e.target.value})}>
            <input type='radio' id='genderOpt1'
            name='gender' value='Male' className='signup-form__radio-button' checked={gender === 'Male'}/>
            <label htmlFor='genderOpt1' className='signup-form__radio-label'>Male</label>

            <input type='radio' id='genderOpt2'
            name='gender' value='Female' className='signup-form__radio-button' checked={gender === 'Female'}/>
            <label htmlFor='genderOpt2' className='signup-form__radio-label' >Female</label>

            <input type='radio' id='genderOpt3'
            name='gender' value='Other' className='signup-form__radio-button' checked={gender === 'Other'}/>
            <label htmlFor='genderOpt3' className='signup-form__radio-label'>Other</label>
          </fieldset>
        </div>
        <div className='signup-form__descriptions'>
          <div className='signup-form__descriptions-title'>Role Description(s)*</div>
          <p>Please give at least one description* based on your role(s) as mentor and/or mentee (it is optional to make them public). Briefly describe what type of training you do as a Mentor or desire as Mentee.</p>
          <label className='signup-form__checkbox-label'><input type='checkbox' name='mentorIsPublic' value={mentorIsPublic} className='signup-form__checkbox' onChange={e => setUserProp({mentorIsPublic: e.target.checked})}/>Make public</label>
          <label className='signup-form__label'>
            <div className='signup-form__label-text'>Mentor Description</div>
            <textarea className='signup-form__textarea' name='mentorDesc' value={mentorDesc} onChange={e => setUserProp({mentorDesc: e.target.value})}></textarea>
          </label>
          <label className='signup-form__checkbox-label'><input type='checkbox' name='menteeIsPublic' value={menteeIsPublic} className='signup-form__checkbox' onChange={e => setUserProp({menteeIsPublic: e.target.checked})}/>Make public</label>
          <label className='signup-form__label'>
            <div className='signup-form__label-text'>Mentee Description</div>
            <textarea className='signup-form__textarea' name='menteeDesc' value={menteeDesc} onChange={e => setUserProp({menteeDesc: e.target.value})}></textarea>
          </label>

        </div>
      </div>
      <button type='submit' className='button signup-form__button'>Sign Up</button>
    </form>
    </main>
  )
}

export default Signup
