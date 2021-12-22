import { combineReducers } from 'redux';
import clientReducer from './clientReducer';
import searchReducer from './searchReducer';

export default combineReducers({
    clientReducer,
    searchReducer
});