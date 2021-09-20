import { boxItemSize, Mode, Size } from "../config/game.config";
import { IBoxItem, ICoordinate, IOptions } from "../types";
import { getSuffleArray } from "./suffle";

/**
 * 生成游戏元素
 */
export const createGameItems = ({width = 0, height = 0, mines = 0} = <{ width: number; height: number; mines: number }>{}) => {
  const suffleArr = getSuffleArray(width * height);
  const items: IBoxItem[][] = [];

  for (let i = 0; i < height; i++) {
    items.push([])
  }

  // 布雷
  suffleArr.forEach((item, index) => {
    const y = Math.floor(item / width);
    const x = Math.floor(item % width);

    items[y][x] = {
      x,
      y,
      value:  index < mines ? 'MINE' : 0,
      isDeathItem: false,
      type: 'DEFAULT'
    }
  });

  // 计算雷周边的数值
  let item;
  for (let j = 0; j < height; j++) {
    for (let k = 0; k < width; k++) {
      item = items[j][k];
      if (item.value === 'MINE') {
        setNumber(item.x, item.y);
      }
    }
  }

  // 设置数值
  function setNumber (x: number, y: number): void {
    getRightfulItems(x, y, items).forEach((item) => {
      if (items[item[1]][item[0]].value !== 'MINE') {
        (items[item[1]][item[0]].value as number) += 1;
      }
    });
  }

  return items;
}

// 获取当前模式宽、高以及地雷数量
export const getDefaultSize = (options: IOptions) => {
  if (options.mode === Mode.customized) {
    const { width, height, mines } = options.customizedOptions
    return { width: +width, height: +height, mines: +mines };
  }
  const [w, h, m] = Size[options.mode]
  return { width: w, height: h, mines: m };
}

export function getRightfulItems (x: number, y: number, items: IBoxItem[][]) {
  if (items.length === 0 || items[0].length === 0) {
    return [];
  }
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y], [x, y], [x +1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
  ].filter(([x, y]) => {
    if (
      x < 0 ||
      y < 0 ||
      x >= items[0].length ||
      y >= items.length
    ) {
      return false;
    }
    return true;
  })
}

export function getClickItemCoordinate (e: MouseEvent, el: HTMLCanvasElement): ICoordinate | null {
  const { clientX, clientY } = e;
  const { left, top, width, height } = el.getBoundingClientRect();

  // 判断是否为有效点击
  if (
    clientX < left || clientX > left + width ||
    clientY < top || clientY > top + height
  ) {
    // 无效点击
    return null;
  }

  // 点击中的元素
  const [w, h] = boxItemSize;
  const x = Math.floor((clientX - left) / w);
  const y = Math.floor((clientY - top) / h);

  return { x, y };
}

export function isSameItem ({ x: x1, y: y1 }: ICoordinate, { x: x2, y: y2 }: ICoordinate): boolean {
  return x1 === x2 && y1 === y2;
}
