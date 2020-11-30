import React, {useEffect} from 'react';
import {NavLink} from 'react-router-dom';

const Welcome = () => {

  useEffect(() => {
    const images = [
      ['/images/mentoring_1280_web.jpg', 'Hand writing in red ink "MENTORING"'],
      ['/images/new-heights_1280_web.jpg', 'Silhouette of one person helping another reach a mountain peak at sunrise'],
      ['/images/teamwork_1280_web.jpg', 'Chalkboard sketch of a gear surrounded by two people on top of the word "TEAMWORK"'],
      ['/images/mentor_1280_web.jpg', 'Sketched outline of person with concepts montage (e.g. method, practice, imrpove, mentor, etc.)'],
      ['/images/handshake_1280_web.jpg', 'A handshake through a computer screen'],
      ['/images/coaching_1280_web.jpg', 'Coaching cycle: Goal, Options, Reality, Will Do'],
      ['/images/skills_1280_web.jpg', 'Handshake in background of words: Skills, Learning, Experience, Ability, Growth, Training, Competence, Knowledge'],
    ];
    const firstImg = document.getElementById('welcome-pic-1');
    const secondImg = document.getElementById('welcome-pic-2');
    const cssTransitionTime = 2000;
    let next = 1;

    const interval = setInterval(()=> {
      if(firstImg.classList.contains('hide')) {
        firstImg.src = images[next][0];
        firstImg.alt = images[next][1];
      }
      else {
        secondImg.src = images[next][0];
        secondImg.alt = images[next][1];
      }
      firstImg.classList.toggle('hide');
      secondImg.classList.toggle('hide');
      next + 1 === images.length ? next = 0 : ++next;
    }, 2000*2);

    return () => clearInterval(interval);

  }, []);

  return (
    <main className='page welcome-page'>
      <h2>Welcome to Mentor Me</h2>
      <section className='welcome-pics'>
        <img id='welcome-pic-1' className='welcome-img' src='/images/mentoring_1280_web.jpg' alt='Hand writing in red ink "MENTORING"' />
        <img id='welcome-pic-2' className='welcome-img hide' src='/images/new-heights_1280_web.jpg' alt='Silhouette of one person helping another reach a mountain peak at sunrise' />
      </section>
      <section className='welcome-info'>
        <p>Mentor Me is a place to find or be a mentor.</p>
        <p>Do you have skills or experience in an area and seek to guide others in gaining those skills? Then maybe you want to become a mentor.</p>
        <p>Do you need guidance, structure, and motivation to achieve your goals? Then maybe you need to be mentored.</p>
        <p>Whichever is your desire (or both), <NavLink to='/signup'>signup</NavLink> and start seeking to make a connection as a Mentor or Mentee today.</p>
      </section>
    </main>
  )
}

export default Welcome
