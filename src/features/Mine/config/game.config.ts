/**
 * 游戏配置
 */

import { ICustomizedOptions, IOptions, IWrapperSize } from '../types';

export const STORAGE_OPTIONS_KEY = 'MINE_OPTIONS';

export enum Mode {
  primary,
  middle,
  high,
  customized
}

export enum GameStatus {
  free = '游戏空闲中',
  playing = '正在游戏',
  failed = '游戏失败',
  successful = '游戏成功'
}

// export const GameStatus = Object.freeze({
//   start: '开始游戏',
//   playing: '正在游戏',
//   finish: '游戏结束'
// })

export const Size = Object.freeze({
  [Mode.primary]: <IWrapperSize>[9, 9, 10],
  [Mode.middle]: <IWrapperSize>[16, 16, 40],
  [Mode.high]: <IWrapperSize>[30, 16, 99]
})

export const CustomizedLimit = Object.freeze({
  width: [9, 30],
  height: [9, 24],
  mines: [10, 668]
})

export const defaultCustomizedOptions = Object.freeze<ICustomizedOptions>({
  width: 30,
  height: 24,
  mines: 668
});

export const defaultOptions = Object.freeze<IOptions>({
  mode: Mode.primary,
  customizedOptions: defaultCustomizedOptions,
  allowSuspicious: false
})

export const interfaceSize: [number, number, number] = [40, 8, 2]; // headerHeight, padding, borderSize
export const boxItemSize: [number, number] = [32, 32];

export const colors = Object.freeze({
  normal: ['#d8d8d8', '#fff', '#808080'],
  active: ['#d8d8d8', '#808080', '#fff'],
  open: ['#d8d8d8', '#909090'],
  number: ['', '#1310AB', '#247D2B', '#CF1E32', '#000A66', '#5D191E', '#008080', '#000', '#7D7D7D']
})
