import { combineReducers} from 'redux';
import authenticationReducer from '../features/authentication/authenticationReducer';
import groupReducer from '../features/groups/groupReducer';
import profileReducer from '../features/profileContent/profileReducer';
import asynchronousReducer from './asynchronousReducer';
import modalReducer from './utilities/modals/modalReducer';
import {connectRouter} from 'connected-react-router';
import postReducer from '../features/feed/postReducer';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    group: groupReducer,
    modals: modalReducer,
    auth: authenticationReducer,
    post: postReducer,
    async: asynchronousReducer,
    profile: profileReducer,
});

export default rootReducer;