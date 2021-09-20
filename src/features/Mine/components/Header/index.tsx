import React, { FC } from 'react';

import { GameStatus, interfaceSize } from '../../config/game.config';

import ControlBtn from './ControlBtn';
import Counter from './Counter';

const Header: FC<{
  mines: number;
  counter: number;
  status: GameStatus,
  setStatus: (status: GameStatus) => void
}> = ({ mines, counter, status, setStatus }) => {
  return (
    <header
      className="header"
      style={{ height: `${interfaceSize[0]}px`, marginBottom: `${interfaceSize[1]}px` }}>
      <Counter counter={ counter } />
      <ControlBtn status={ status } setStatus={ setStatus } />
      <Counter counter={ mines } />
    </header>
  );
}

export default Header;
