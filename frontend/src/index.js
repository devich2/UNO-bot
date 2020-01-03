import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './store/reducers';

export const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));


serviceWorker.unregister();
