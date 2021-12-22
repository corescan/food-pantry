import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger'
import reducer from './reducers/reducer';
import thunk from 'redux-thunk';

const middleWare = [thunk, logger];

const store = createStore(reducer, compose(applyMiddleware(...middleWare)));
export default store;
