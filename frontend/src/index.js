import React from 'react';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'redux';
import configureStore from './store/index.js';
import App from './App';
import {restoreCSRF, fetch} from './store/csrf';
import * as sessionActions from './store/session';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = fetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}
