import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import { ICoordinate } from '../../types';
import {
  BaseScore,
  GameStatus,
  BaseSpeed,
  Size,
  SizeType,
  SnakeContext,
} from '../../views/Snake';
import GameCanvas from '../../libs/canvas/GameCanvas';
import useSnake from '../common/hooks/useSnake';
import useBarriers from '../common/hooks/useBarriers';
import Modal from './Modal/Modal';

export type ISnakeItem = ICoordinate;
export type IFoodItem = ICoordinate;

export enum Direction {
  Up = 1,
  Right,
  Down,
  Left,
}

const Game: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode, status, score, setStatus, setScore } = useContext(SnakeContext);

  const barriers = useBarriers(mode, Size);

  const { snake, setSnake, food, setFood } = useSnake(Size, barriers);

  const [direction, setDirection] = useState(Direction.Right);

  const { row, col, item } = Size;

  function getNextHead(item: ICoordinate, direction: Direction): ICoordinate {
    let { x, y } = item;
    switch (direction) {
      case Direction.Up:
        y -= 1;
        break;
      case Direction.Right:
        x += 1;
        break;
      case Direction.Down:
        y += 1;
        break;
      case Direction.Left:
        x -= 1;
        break;
      default:
        break;
    }
    return { x, y };
  }

  function getNextFrame(
    snake: ISnakeItem[],
    food: IFoodItem,
    direction: Direction,
    size: SizeType,
    barriers: ICoordinate[]
  ) {
    const { x, y } = getNextHead(snake[0], direction);
    if (x === food.x && y === food.y) {
      return {
        finised: false,
        changeFood: true,
        snake: [food, ...snake],
      };
    }
    if (
      // 碰到自身
      snake.some((item) => item.x === x && item.y === y) ||
      // 碰到边界
      x === -1 ||
      y === -1 ||
      x === size.row ||
      y === size.col ||
      // 碰到障碍物
      barriers.some((item) => item.x === x && item.y === y)
    ) {
      return {
        finised: true,
        changeFood: false,
        snake,
      };
    }
    return {
      finised: false,
      changeFood: false,
      snake: [{ x, y }, ...snake.slice(0, snake.length - 1)],
    };
  }

  function changeDirection({ key }: KeyboardEvent) {
    switch (key) {
      case 'ArrowUp':
        if (direction !== Direction.Down) {
          setDirection(Direction.Up);
        }
        break;
      case 'ArrowRight':
        if (direction !== Direction.Left) {
          setDirection(Direction.Right);
        }
        break;
      case 'ArrowDown':
        if (direction !== Direction.Up) {
          setDirection(Direction.Down);
        }
        break;
      case 'ArrowLeft':
        if (direction !== Direction.Right) {
          setDirection(Direction.Left);
        }
        break;
      case ' ':
        setStatus(
          status === GameStatus.Pause ? GameStatus.Playing : GameStatus.Pause
        );
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    // 计算积分
    setScore((snake.length - 3 > 0 ? snake.length - 3 : 0) * BaseScore[mode]);
    let gameCanvas: GameCanvas | null = new GameCanvas(
      canvasRef.current!,
      item
    );
    let t: NodeJS.Timeout;
    switch (status) {
      case GameStatus.Start:
        setSnake([]);
        setFood();
        setDirection(Direction.Right);
        setStatus(GameStatus.Loading);
        break;
      case GameStatus.Loading:
        gameCanvas.drawLoading(3).then(() => {
          setStatus(GameStatus.Playing);
        });
        break;
      case GameStatus.Playing:
        // 监听键盘事件
        window.addEventListener('keydown', changeDirection, false);
        // 绘制
        gameCanvas!.draw(snake, food, direction, barriers);
        t = setTimeout(() => {
          const { finised, changeFood, snake: currentSnake } = getNextFrame(
            snake,
            food,
            direction,
            Size,
            barriers
          );
          if (finised) {
            setStatus(GameStatus.Finshed);
            return;
          }
          if (changeFood) {
            setFood();
          }
          setSnake(currentSnake);
        }, BaseSpeed[mode]);
        break;
      case GameStatus.Free:
        gameCanvas.clear();
        setScore(0);
        break;
      case GameStatus.Pause:
        window.addEventListener('keydown', changeDirection, false);
        break;
      case GameStatus.Finshed:
        break;
      default:
        break;
    }

    return () => {
      gameCanvas = null;
      window.removeEventListener('keydown', changeDirection, false);
      clearTimeout(t);
    };
  }, [mode, status, food, snake]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} width={row * item} height={col * item} />
      {status === GameStatus.Pause && (
        <Modal title="暂停游戏">
          <div className="pause-wrapper">
            <button
              className="btn btn-primary"
              onClick={() => setStatus(GameStatus.Playing)}
            >
              继续游戏
            </button>
            <button
              className="btn btn-success"
              onClick={() => setStatus(GameStatus.Start)}
            >
              重新开始
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setStatus(GameStatus.Free)}
            >
              退出本局
            </button>
          </div>
        </Modal>
      )}

      {status === GameStatus.Finshed && (
        <Modal title="游戏结束">
          <div className="game-over-wrapper">
            <div className="score-wrapper">
              <div className="item length">
                总长度：<em>{snake.length}</em>
              </div>
              <div className="item score">
                得分：<em>{score}</em>
              </div>
            </div>

            <div className="operations">
              <button
                className="btn btn-success"
                onClick={() => setStatus(GameStatus.Start)}
              >
                再来一局
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setStatus(GameStatus.Free)}
              >
                退出
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Game;
