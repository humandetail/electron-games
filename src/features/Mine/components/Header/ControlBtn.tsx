import React, { FC } from 'react';
import { GameStatus } from '../../config/game.config';

const ControlBtn: FC<{ status: GameStatus, setStatus: (status: GameStatus) => void }> = ({ status, setStatus }) => {
  const handleRestart = () => {
    setStatus(GameStatus.free);
  }

  const getBtnStatus = (status: GameStatus): 'sad' | 'smile' | 'smile-glasses' => {
    switch (status) {
      case GameStatus.failed:
        return 'sad';
      case GameStatus.successful:
        return 'smile-glasses';
      default:
        return 'smile';
    }
  }

  return (
    <div
      className={ `btn-control ${getBtnStatus(status)}` }
      onClick={ handleRestart }
    />
  );
}

export default ControlBtn;
