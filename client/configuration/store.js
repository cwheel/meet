import React from 'react'

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import conference from '../reducers/conference';
import metaChannel from '../reducers/metaChannel';
import camera from '../reducers/camera';

export default function (history, initialState = {}) {
    const reducer = combineReducers({
        routing: routerReducer,
        metaChannel,
        camera,
        conference
    });

    const store = createStore(
        reducer,
        initialState,
        applyMiddleware(
            thunk,
            routerMiddleware(history)
        )
    );

    return store;
}
