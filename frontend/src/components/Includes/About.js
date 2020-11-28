import React from 'react';

const About = () => {
  return (
    <div className='about'>
      <p className='about-info'>Mentor Me was designed by Scott Smith</p>
      <img src='https://avatars1.githubusercontent.com/u/2047892?s=460&u=1a36952bcc5af97268e8d4ded1b962835436ccbe&v=4' alt='Scott Smith, site developer' className='about-img'/>
      <div className='about-links-group'>
      <a className='about-link' href='https://github.com/scottgit' target='_blank' rel="noreferrer">GitHub Profile</a>
      <a className='about-link' href='https://stackoverflow.com/users/369707/scotts' target='_blank' rel="noreferrer">Stack Overflow Profile</a>
      <a className='about-link' href='https://www.linkedin.com/in/one-scott-smith/' target='_blank' rel="noreferrer">Linked In Profile</a>
      </div>
    </div>
  )
}

export default About
