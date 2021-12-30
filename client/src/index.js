import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import store from './redux/store';
import App from './App/App';
import './index.css';

render(
  <Provider store={store}>
    <BrowserRouter basename='/app'>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
