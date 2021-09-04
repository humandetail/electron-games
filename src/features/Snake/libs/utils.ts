/**
 * utils
 */

import { ICoordinate } from '../types';

/**
 * 获取随机数
 * @param min - 最小值
 * @param max - 最大值
 * @param decimal - 保留小数
 * @return 返回 [min,max] 区间中的随机值
 */
export function getRandom(min = 0, max = 1, decimal = 0): number {
  return +(Math.random() * (max - min) + min).toFixed(decimal);
}

/**
 * 生成坐标点
 */
export function createCoordinate(x: number, y: number): ICoordinate {
  return { x, y };
}

/**
 * 生成食物坐标
 */
export function createFood(
  row: number,
  col: number,
  exclude: ICoordinate[]
): ICoordinate {
  const x = getRandom(0, row - 1);
  const y = getRandom(0, col - 1);

  if (exclude.some((item) => item.x === x && item.y === y)) {
    return createFood(row, col, exclude);
  }

  return createCoordinate(x, y);
}

export function createRAF(duration = 16) {
  let t = 0;
  let prevTime = 0;
  let times = 1;

  const loop = function (
    callback: Function,
    maxTimes: number = Number.MAX_SAFE_INTEGER
  ) {
    // @ts-ignore
    if (!prevTime) {
      prevTime = new Date().getTime();
      callback();
      times++;
    } else {
      const curTime = new Date().getTime();
      if (curTime - prevTime >= duration) {
        prevTime = curTime - ((curTime - prevTime) % duration);
        callback();
        times++;
      }
    }
    if (times <= maxTimes) {
      t = requestAnimationFrame(loop.bind(null, callback, maxTimes));
    } else {
      loop.stop();
    }
  };
  loop.stop = function () {
    cancelAnimationFrame(t);
    prevTime = 0;
    t = 0;
  };
  return loop;
}
