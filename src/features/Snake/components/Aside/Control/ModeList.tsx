import React, { FC, useContext } from 'react';

import { Mode, GameStatus, SnakeContext } from '../../../views/Snake';

const ModeList: FC = () => {
  const { mode, setMode, status } = useContext(SnakeContext);

  const list = [Mode.EASY, Mode.NORMAL, Mode.HARD, Mode.HELL];

  function handleSetMode(newMode: Mode) {
    if (
      mode !== newMode &&
      (status === GameStatus.Free || status === GameStatus.Finshed)
    ) {
      setMode(newMode);
    }
  }

  return (
    <ul className="mode-list">
      {list.map((item) => (
        <li
          key={item}
          className={`item${item === mode ? ' current' : ''}${
            status === GameStatus.Free || status === GameStatus.Finshed
              ? ''
              : ' disabled'
          }`}
          onClick={() => handleSetMode(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default ModeList;
