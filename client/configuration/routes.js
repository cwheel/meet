import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Conference from '../components/conference';

const routes = (
  <Route path='/'>
      <IndexRoute component={ Conference } />
  </Route>
);

export default routes;
