import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Snake from '../views/Snake';

type Props = {
  prefix?: string;
};

export default function (props: Props) {
  const { prefix = '' } = props;
  return (
    <Router>
      <Switch>
        <Route path={`${prefix}/`} component={Snake} />
      </Switch>
    </Router>
  );
}
