import React, {FC, useEffect, useState } from 'react';

import { ipcRenderer } from 'electron';
import { CHANGE_GAME_STATUS, CHANGE_OPTIONS } from '../config/msg-constant.config';
import { interfaceSize, defaultOptions, GameStatus } from '../config/game.config';
import { IBoxItem, IOptions } from '../types';

import Header from '../components/Header';
import Game from '../components/Game';
import useStatus from '../hooks/useStatus';
import { createGameItems, getDefaultSize } from '../libs/utils';

// export const MineContext = createContext({
//   mode: Mode.primary,
//   counter: 0,
//   mines: Size[Mode.primary][2]
// });

const Mine: FC = () => {
  const [options, setOptions] = useState<IOptions>(defaultOptions);
  const [status, counter, setStatus, clearCounter] = useStatus();
  const [mines, setMines] = useState(0);
  const [items, setItems] = useState<IBoxItem[][]>([])

  ipcRenderer.on(CHANGE_OPTIONS, (_e, options: IOptions) => {
    setOptions(options);
    setStatus(GameStatus.free);
  });

  // const providerValue = {
  //   mode: options.mode,
  //   counter,
  //   mines
  // }

  // // 获取当前模式宽、高以及地雷数量
  // const getDefaultSize = (options: IOptions) => {
  //   switch (options.mode) {
  //     case Mode.customized:
  //       const { width, height, mines } = options.customizedOptions
  //       return { width: +width, height: +height, mines: +mines };
  //     default:
  //       const [w, h, m] = Size[options.mode]
  //       return { width: w, height: h, mines: m };
  //   }
  // }

  useEffect(() => {
    setStatus(GameStatus.playing);
    setMines(+getDefaultSize(options).mines);
  }, [options]);

  useEffect(() => {
    switch (status) {
      case GameStatus.free:
        setStatus(GameStatus.playing);
        break;
      case GameStatus.playing:
        setItems(createGameItems(getDefaultSize(options)))
        break;
      case GameStatus.failed:
        ipcRenderer.send(CHANGE_GAME_STATUS, 'failed', clearCounter());
        break;
      case GameStatus.successful:
        ipcRenderer.send(CHANGE_GAME_STATUS, 'successful', clearCounter());
        break;
      default:
        break;
    }
  }, [status])

  return (
    <div className="page-mine" style={{ padding: `${interfaceSize[1]}px` }}>
      <Header
        counter={ counter }
        mines={ mines }
        status={ status }
        setStatus={ setStatus }
      />
      <Game
        mines={ mines }
        items={ items }
        status={ status }
        options={ options }
        setMines={ setMines }
        setStatus={ setStatus }
      />
    </div>
  );
}

export default Mine;
