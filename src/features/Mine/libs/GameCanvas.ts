/**
 * 游戏画板
 */

import { IBoxItem, IBoxItemValue } from "../types";
import { boxItemSize, colors, interfaceSize } from '../config/game.config';

export default class GameCanvas {

  protected ctx!: CanvasRenderingContext2D;

  protected isFailed = false;

  public width = 0;

  public height = 0;

  public borderSize = 2;

  constructor (
    protected canvas: HTMLCanvasElement,
    protected items: IBoxItem[][],
  ) {
    this.init();
  }

  init () {
    const { canvas, items } = this;
    if (items.length > 0 && items[0].length > 0) {
      this.ctx = canvas.getContext('2d')!;
      const [x, y] = [items[0].length, items.length];
      const width = x * boxItemSize[0];
      const height = y * boxItemSize[1];

      ([, ,this.borderSize] = interfaceSize);

      this.canvas.width = width;
      this.canvas.height = height;
      this.width = width;
      this.height = height;
      this.draw(items);
    }
  }

  draw (items: IBoxItem[][], isFailed = false) {
    this.isFailed = isFailed;

    this.clear();

    items.forEach((row) => {
      if (row) {
        row.forEach((col) => {
          this.drawItem(col);
        })
      }
    })
  }

  drawItem (item: IBoxItem) {
    const { x, y, value, isDeathItem, type } = item;
    if (isDeathItem) {
      this.drawMineItem(x, y, true);
      return;
    }

    if (type === 'OPEN') {
      if (value === 'MINE') {
        this.drawMineItem(x, y, false, false);
      } else {
        this.drawOpenItem(x, y, value);
      }
      return;
    }
    if (type === 'ACTIVE') {
      this.drawActiveItem(x, y);
      return;
    }
    this.drawNormalItem(item);
  }

  // 绘制普通元素
  drawNormalItem ({x, y, type, value}: IBoxItem) {
    const [width, height] = boxItemSize;
    const { ctx } = this;
    const { normal } = colors;

    ([ctx.fillStyle] = normal);
    ctx.fillRect(x * width, y * height, width, height);
    this.drawItemBorder(x, y, width, height, this.borderSize, [normal[1], normal[2]]);

    switch (type) {
      case 'MARK':
        this.drawMarkItem(x, y, width, height, value);
        break;
      case 'SUSPICIOUS':
        this.drawSuspicious(x, y, width, height);
        break;
      default:
        break;
    }
  }

  // 绘制已经开启的元素
  drawOpenItem (x: number, y: number, value: IBoxItemValue) {
    const [width, height] = boxItemSize;
    const { ctx } = this;
    const { open, number } = colors;

    ([ctx.fillStyle] = open);
    ctx.fillRect(x * width, y * height, width, height);

    // 绘制数据
    if (typeof value === 'number') {
      if (value !== 0) {
        ctx.fillStyle = number[value];
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `small-caps bold ${height}px Tahoma`;
        ctx.fillText(String(value), x * width + width / 2, y * height + height / 2 + 2);
      }
    }

    this.drawItemBorder(x, y, width, height, 1, [open[1], open[1]]);
  }

  // 绘制活跃元素
  drawActiveItem (x: number, y: number) {
    const [width, height] = boxItemSize;
    const { ctx } = this;
    const { normal } = colors;

    ([ctx.fillStyle] = normal);
    ctx.fillRect(x * width, y * height, width, height);

    this.drawItemBorder(x, y, width, height, this.borderSize, [normal[2], normal[1]]);
  }

  // 画地雷
  drawMineItem (x: number, y: number, isDeath = false, isWrong = false) {
    const [width, height] = boxItemSize;
    const { ctx, borderSize } = this;
    const { open } = colors;

    const resetSize = width - borderSize * 2;

    this.drawItemBorder(x, y, width, height, 1, [open[1], open[1]]);

    ctx.save();
    ctx.translate(x * width + width / 2, y * height + height / 2);

    if (isDeath) {
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.fill();
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.fillStyle = '#0f0f0f';
    ctx.arc(0, 0, resetSize * 0.35, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    for (let i = 0; i < 4; i++) {
      ctx.rotate(45 * Math.PI / 180);
      ctx.strokeStyle = '#0f0f0f'
      ctx.beginPath();
      ctx.lineWidth = borderSize;
      ctx.lineCap = 'round';
      ctx.moveTo(-resetSize * (i % 2 === 0 ? 0.38 : 0.42), 0);
      ctx.lineTo(resetSize * (i % 2 === 0 ? 0.38 : 0.42), 0);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
    ctx.save();
    ctx.translate(x * width + width / 2, y * height + height / 2);
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(-resetSize * 0.15, -resetSize * 0.15, resetSize * 0.08, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    if (isWrong) {
      for (let i = 0; i < 2; i++) {
        ctx.rotate((i % 2 === 0 ? 45 : 90) * Math.PI / 180);
        ctx.strokeStyle = '#f00'
        ctx.beginPath();
        ctx.lineWidth = borderSize;
        ctx.moveTo(-width * 0.5, 0);
        ctx.lineTo(width * 0.5, 0);
        ctx.stroke();
        ctx.closePath();
      }
    }

    ctx.restore();
  }

  // 绘制插旗元素
  drawMarkItem (x: number, y: number, width: number, height: number, value: IBoxItemValue) {
    const { ctx, borderSize } = this;

    if (this.isFailed) {
      // 游戏结束
      // 插错旗的元素
      if (typeof value === 'number') {
        this.drawMineItem(x, y, false, true);
      }
      return;
    }

    ctx.save();

    ctx.translate(x * width, y * height);

    // 绘制底座 + 旗杆
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(borderSize * 3, height - borderSize * 4, width - borderSize * 6, borderSize * 2)

    ctx.beginPath();
    ctx.fillRect(borderSize * 5, height - borderSize * 5.5, width - borderSize * 10, borderSize * 1.5)
    ctx.closePath();
    ctx.fillStyle = '#0f0f0f';
    ctx.fill();

    ctx.strokeStyle = '#0f0f0f';
    ctx.lineWidth = borderSize;
    // ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(width - borderSize * 7, height - borderSize * 5.5);
    ctx.lineTo(width - borderSize * 7, borderSize * 2)
    ctx.stroke();
    ctx.closePath();

    // 旗子
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.moveTo(width - borderSize * 6.5, borderSize * 2)
    ctx.lineTo(width - borderSize * 7.5, borderSize * 2)
    ctx.lineTo(borderSize * 2, (height - borderSize * 5.5 - borderSize * 2) / 2)
    ctx.lineTo(width - borderSize * 7.5, (height - borderSize * 5.5 - borderSize * 2))
    ctx.lineTo(width - borderSize * 6.5, (height - borderSize * 5.5 - borderSize * 2))
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 绘制可疑元素
  drawSuspicious (x: number, y: number, width: number, height: number) {
    const { ctx } = this;

    ctx.beginPath();
    ctx.fillStyle = '#0f0f0f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `small-caps bold ${height - 4}px Tahoma`;
    ctx.fillText('?', x * width + width / 2, y * height + height / 2 + 2);
    ctx.closePath();
  }

  // 绘制元素边框
  drawItemBorder (x: number, y: number, width: number, height: number, size: number, colors: [string, string]) {
    const { ctx } = this;
    // 绘制上左两条边框
    ctx.beginPath();
    ctx.moveTo(x * width + width, y * height); // 从右顶点开始
    ctx.lineTo(x * width, y * height); // 到左顶点
    ctx.lineTo(x * width, y * height + height) // 到下顶点
    ctx.lineTo(x * width + size, y * height + height - size);
    ctx.lineTo(x * width + size, y * height + size);
    ctx.lineTo(x * width + width - size, y * height + size);
    ctx.closePath();
    ([ctx.fillStyle] = colors);
    ctx.fill();
    // 绘制右下两条边框
    ctx.beginPath();
    ctx.moveTo(x * width + width, y * height); // 从右顶点开始
    ctx.lineTo(x * width + width - size, y * height + size);
    ctx.lineTo(x * width + width - size, y * height + height - size);
    ctx.lineTo(x * width + size, y * height + height - size)
    ctx.lineTo(x * width, y * height + height); // 到左下顶点
    ctx.lineTo(x * width + width, y * height + height); // 到右下顶点
    ctx.closePath();
    ([, ctx.fillStyle] = colors);
    ctx.fill();
  }

  clear () {
    const { ctx, width, height } = this;

    ctx.clearRect(0, 0, width, height);
  }
}
