import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css'
import './css/index.css';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from './store/index.js';
import App from './App';
import {restoreCSRF, fetch} from './store/csrf';
import * as sessionActions from './store/session';
import { ModalProvider } from './components/Includes/Modal';

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
      <ModalProvider >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalProvider>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);
