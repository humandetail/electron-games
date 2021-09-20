import React, { lazy, Suspense } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Home from './features/Home';
import './App.global.scss';

const Snake = lazy(() => import('./features/Snake/routes'));
const Mine = lazy(() => import('./features/Mine/routes'));

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Suspense fallback="">
          <Snake prefix="/snake" />
          <Mine prefix="/mine" />
        </Suspense>
        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
}
