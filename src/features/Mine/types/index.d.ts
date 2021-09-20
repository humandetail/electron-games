import { Mode } from "../config/game.config";

export interface ICoordinate {
  x: number;
  y: number;
}

export type IBoxItemType = 'DEFAULT' | 'ACTIVE' | 'OPEN' | 'MARK' | 'SUSPICIOUS';

export type IBoxItemValue = number | 'MINE';

export interface IBoxItem extends ICoordinate {
  value: IBoxItemValue,
  isDeathItem: boolean;
  type: IBoxItemType;
}

export type IWrapperSize = [number, number, number]; // width, height and number of mines

export type ICustomizedOptions = {
  width: number | string;
  height: number | string;
  mines: number | string;
}

export interface IOptions {
  mode: Mode,
  customizedOptions: ICustomizedOptions,
  allowSuspicious: boolean;
}
