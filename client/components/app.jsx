import React from 'react';

import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import Immutable from 'immutable';

import routes from '../configuration/routes';
import store from '../configuration/store';

class App extends React.Component {
    constructor() {
        super();

        this.store = store(browserHistory);
        this.history = syncHistoryWithStore(browserHistory, this.store);
    }

    render() {
        return (
            <Provider store={this.store}>
                <Router history={this.history} routes={routes} />
            </Provider>
        );
    }
}

export default App;
