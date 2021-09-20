import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Mine from '../views/Mine';
import MineOptions from '../views/MineOptions';

type Props = {
  prefix?: string;
};

export default function (props: Props) {
  const { prefix = '' } = props;
  return (
    <Router>
      <Switch>
        <Route path={`${prefix}/`} exact component={Mine} />
        <Route path={`${prefix}/options`} component={MineOptions} />
      </Switch>
    </Router>
  );
}
