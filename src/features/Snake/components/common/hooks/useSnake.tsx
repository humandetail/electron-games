/**
 * useSnake
 */

import { useState } from 'react';

import { Size } from '../../../views/Snake';
import { createCoordinate, createFood } from '../../../libs/utils';
import { IFoodItem, ISnakeItem } from '../../Game';
import { ICoordinate } from '../../../types';

export default function (size: typeof Size, barriers: ICoordinate[]) {
  const { row, col } = size;

  const halfCol = Math.floor(Size.col / 2);
  const halfRow = Math.floor(Size.row / 2);

  const baseSnake: ISnakeItem[] = [
    createCoordinate(halfRow + 1, halfCol),
    createCoordinate(halfRow, halfCol),
    createCoordinate(halfRow - 1, halfCol),
  ];

  const [snake, setSnake] = useState<Array<ISnakeItem>>(baseSnake);
  const [food, setFood] = useState<IFoodItem>(createFood(row, col, snake));

  return {
    snake,
    setSnake: (snake: Array<ISnakeItem>) => {
      if (snake.length === 0) {
        setSnake(baseSnake);
      } else {
        setSnake(snake);
      }
    },
    food,
    setFood: () => setFood(createFood(row, col, [...snake, ...barriers])),
  };
}
