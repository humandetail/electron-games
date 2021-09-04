import React, { FC } from 'react';

import Header from './Header';
import Control from './Control';
import State from './State';

const Aside: FC = () => {
  return (
    <div className="aside">
      <Header />
      <Control />
      <State />
    </div>
  );
};

export default Aside;
