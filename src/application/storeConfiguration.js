import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import { verifyAuth } from '../features/authentication/authenticationActions';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
export const storeConfiguration = () => {
    
    const store = createStore(rootReducer(history), composeWithDevTools(applyMiddleware(thunk)));
    store.dispatch(verifyAuth());

    return store;
}