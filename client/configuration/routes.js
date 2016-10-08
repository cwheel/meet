import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Conference from '../components/conference';
import NewConference from '../components/newConference';

const routes = (
  <Route path='/'>
      <IndexRoute component={ NewConference } />
      <Route path='r/:room/:nick' component={ Conference } />
  </Route>
);

export default routes;
