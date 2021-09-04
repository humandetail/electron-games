/**
 * Game canvas
 */

import { Direction, IFoodItem, ISnakeItem } from '../../components/Game';
import { ICoordinate } from '../../types';
import { createRAF } from '../utils';

export const itemColor = {
  normal: '#333',
  food: '#f5222d',
};

export default class GameCanvas {
  protected ctx!: CanvasRenderingContext2D;

  protected width = 0;

  protected height = 0;

  constructor(protected canvas: HTMLCanvasElement, protected itemSize: number) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  drawLoading(num: number): Promise<void> {
    return new Promise((resolve) => {
      const loop = createRAF(1000);
      loop(() => {
        if (num === 0) {
          loop.stop();
          this.clear();
          resolve();
        } else {
          this.drawLoadingNumber(num--, 1000);
        }
      }, num + 1);
    });
  }

  drawLoadingNumber(num: number, maxDuration: number) {
    const { ctx, width, height } = this;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const baseFontSize = 50;

    const loop = createRAF(100);
    let times = 1;
    const i = maxDuration / 100;

    loop(() => {
      if (times >= i) {
        loop.stop();
      } else {
        ctx.clearRect(0, 0, width, height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${baseFontSize + times * i}px SanFrancisco`;
        ctx.fillStyle = '#333';
        ctx.fillText(num.toString(), halfWidth, halfHeight);

        times++;
      }
    });
  }

  /**
   * 绘制游戏元素
   * @param snake 蛇
   * @param food 食物
   * @param direction 当前运动方向
   * @param barriers 障碍物
   */
  draw(
    snake: ISnakeItem[],
    food: IFoodItem,
    direction: Direction,
    barriers: ICoordinate[]
  ) {
    this.clear();
    const len = snake.length;
    snake.forEach((item, index) => {
      if (index === 0) {
        // 头部
        this.drawItemHead(item, direction);
      } else if (index === len - 1) {
        // 尾部
        this.drawItemTail(item, snake[index - 1]);
      } else {
        // 身体
        this.drawItem(item);
      }
    });

    this.drawFood(food);
    this.drawBarriers(barriers);
  }

  /**
   * 绘制蛇头
   * @param item 蛇头元素
   * @param dir 当前方向
   */
  drawItemHead(item: ISnakeItem, dir: Direction) {
    const { ctx, itemSize: size } = this;
    const color = itemColor.normal;

    ctx.save();
    ctx.translate(item.x * size, item.y * size);

    // for (let i = 0; i <= 3; i++) {
    //   if (i === 2) continue;
    //   ctx.fillStyle = i % 2 === 0 || i === 3 ? '#fff' : color;

    //   ctx.fillRect(i, i, size - i * 2, size - i * 2);
    // }

    for (let i = 0; i <= 2; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#fff' : color;
      ctx.fillRect(i, i, size - i * 2, size - i * 2);
    }

    let coorA: ICoordinate;
    let coorB: ICoordinate;
    switch (dir) {
      case Direction.Up:
        coorA = {
          x: 5,
          y: 5,
        };
        coorB = {
          x: size - 5,
          y: 5,
        };
        break;
      case Direction.Down:
        coorA = {
          x: 5,
          y: size - 5,
        };
        coorB = {
          x: size - 5,
          y: size - 5,
        };
        break;
      case Direction.Left:
        coorA = {
          x: 5,
          y: 5,
        };
        coorB = {
          x: 5,
          y: size - 5,
        };
        break;
      case Direction.Right:
        coorA = {
          x: size - 5,
          y: 5,
        };
        coorB = {
          x: size - 5,
          y: size - 5,
        };
        break;
      default:
        throw new Error('Invalid direction');
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(coorA.x, coorA.y, 2, 0, 2 * Math.PI);
    ctx.arc(coorB.x, coorB.y, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 绘制元素
   * @param item 元素
   * @param color 元素颜色
   */
  drawItem(item: ICoordinate, color: string = itemColor.normal) {
    const { ctx } = this;
    const size = this.itemSize;

    ctx.save();
    ctx.translate(item.x * size, item.y * size);

    for (let i = 0; i <= 3; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#fff' : color;
      ctx.fillRect(i, i, size - i * 2, size - i * 2);
    }

    ctx.restore();
  }

  /**
   * 绘制蛇尾
   * @param item 蛇尾元素
   * @param prev 上一个元素
   */
  drawItemTail(item: ISnakeItem, prev: ISnakeItem) {
    const { ctx, itemSize: size } = this;
    const color = itemColor.normal;

    ctx.save();
    ctx.translate(item.x * size, item.y * size);

    for (let i = 0; i <= 2; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#fff' : color;
      ctx.fillRect(i, i, size - i * 2, size - i * 2);
    }

    const dir = this.getTailDirection(item, prev);

    let angleA: ICoordinate;
    let angleB: ICoordinate;
    let angleC: ICoordinate;

    switch (dir) {
      case Direction.Up:
        angleA = {
          x: size / 2,
          y: 3,
        };
        angleB = {
          x: 3,
          y: size - 3,
        };
        angleC = {
          x: size - 3,
          y: size - 3,
        };
        break;
      case Direction.Down:
        angleA = {
          x: size / 2,
          y: size - 3,
        };
        angleB = {
          x: 3,
          y: 3,
        };
        angleC = {
          x: size - 3,
          y: 3,
        };
        break;
      case Direction.Left:
        angleA = {
          x: 3,
          y: size / 2,
        };
        angleB = {
          x: size - 3,
          y: 3,
        };
        angleC = {
          x: size - 3,
          y: size - 3,
        };
        break;
      case Direction.Right:
        angleA = {
          x: size - 3,
          y: size / 2,
        };
        angleB = {
          x: 3,
          y: 3,
        };
        angleC = {
          x: 3,
          y: size - 3,
        };
        break;
      default:
        throw new Error('Invalid tail');
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(angleA.x, angleA.y);
    ctx.lineTo(angleB.x, angleB.y);
    ctx.lineTo(angleC.x, angleC.y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * 绘制食物
   * @param food 食物元素
   */
  drawFood(food: IFoodItem) {
    this.drawItem(food, itemColor.food);
  }

  /**
   * 绘制障碍物
   * @param barriers
   */
  drawBarriers(barriers: ICoordinate[]) {
    barriers.forEach((item) => {
      this.drawItem(item, '#abc');
    });
  }

  // 获取尾巴的朝向
  protected getTailDirection(item: ISnakeItem, prev: ISnakeItem) {
    if (item.x === prev.x) {
      return item.y + 1 === prev.y ? Direction.Up : Direction.Down;
    }

    if (item.y === item.y) {
      return item.x + 1 === prev.x ? Direction.Left : Direction.Right;
    }

    throw new Error('Invalid tail.');
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
