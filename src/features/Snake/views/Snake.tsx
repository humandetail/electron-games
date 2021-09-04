import React, { createContext, FC, useState } from 'react';

import Game from '../components/Game';
import Aside from '../components/Aside';

import '../assets/styles/index.scss';

export const Size = {
  row: 34,
  col: 33,
  item: 20,
};

export type SizeType = typeof Size;

export enum Mode {
  EASY = '简单模式',
  NORMAL = '普通模式',
  HARD = '困难模式',
  HELL = '地狱模式',
}

export enum GameStatus {
  Free = '空闲中',
  Loading = '玩命加载中',
  Start = '开始游戏',
  Pause = '暂停游戏',
  Playing = '游戏中',
  Finshed = '游戏已结束',
}

export const BaseScore = {
  [Mode.EASY]: 1,
  [Mode.NORMAL]: 3,
  [Mode.HARD]: 5,
  [Mode.HELL]: 10,
};

export const BaseSpeed = {
  [Mode.EASY]: 300,
  [Mode.NORMAL]: 200,
  [Mode.HARD]: 100,
  [Mode.HELL]: 100,
};

export const SnakeContext = createContext({
  mode: Mode.EASY,
  setMode: () => {},
  status: GameStatus.Free,
  setStatus: () => {},
  score: 0,
  setScore: () => {},
} as {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  status: GameStatus;
  setStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
});

const Snake: FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.EASY);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Free);
  const [score, setScore] = useState(0);

  const providerValue = {
    mode,
    setMode,
    status,
    setStatus,
    score,
    setScore,
  };

  return (
    <SnakeContext.Provider value={providerValue}>
      <div className="page-snake">
        <Game />
        <Aside />
      </div>
    </SnakeContext.Provider>
  );
};

export default Snake;
