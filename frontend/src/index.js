import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'redux';
import configureStore from './store/index.js';
import Root from './Root';
import {restoreCSRF, fetch} from './store/csrf';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = fetch;
  window.store = store;
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
