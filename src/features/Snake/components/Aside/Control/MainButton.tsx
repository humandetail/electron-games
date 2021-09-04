import React, { FC, useContext } from 'react';

import { GameStatus, SnakeContext } from '../../../views/Snake';

interface ITextProps {
  status: GameStatus;
}

const Text: FC<ITextProps> = ({ status }) => {
  if (status === GameStatus.Pause) {
    return <span>继续游戏</span>;
  }
  if (
    status === GameStatus.Loading ||
    status === GameStatus.Start ||
    status === GameStatus.Playing
  ) {
    return <span>暂停游戏</span>;
  }
  return <span>开始游戏</span>;
};

const MainButton: FC = () => {
  const { status, setStatus } = useContext(SnakeContext);

  function handleSetStatus(status: GameStatus) {
    switch (status) {
      case GameStatus.Free:
      case GameStatus.Finshed:
        setStatus(GameStatus.Start);
        break;
      case GameStatus.Pause:
        setStatus(GameStatus.Playing);
        break;
      case GameStatus.Start:
      case GameStatus.Playing:
        setStatus(GameStatus.Pause);
        break;
      case GameStatus.Loading:
      default:
        break;
    }
  }

  return (
    <div
      className={`main-button${
        status === GameStatus.Loading ? ' disabled' : ''
      }`}
      onClick={() => handleSetStatus(status)}
    >
      [
      <Text status={status} />]
    </div>
  );
};

export default MainButton;
