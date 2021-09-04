/**
 * Header canvas
 */

import { ICoordinate } from '../../types';
import { getRandom } from '../utils';

type AnimationCoordinate = ICoordinate & {
  fx: number;
  fy: number;
  speed: number;
};

class HeaderCanvas {
  protected ctx!: CanvasRenderingContext2D;

  protected width!: number;

  protected height!: number;

  protected pixels: AnimationCoordinate[] = [];

  constructor(public canvas: HTMLCanvasElement, public title: string) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.init();
  }

  public init() {
    this.pixels = this.getPixels();
    this.draw();
  }

  protected getPixels(): Array<AnimationCoordinate> {
    const oText = document.createElement('canvas');
    const ctx = oText.getContext('2d')!;
    const width = 124;
    const height = 72;

    oText.width = width;
    oText.height = height;
    oText.style.letterSpacing = '2px';

    oText.style.position = 'absolute';
    oText.style.left = '0';
    oText.style.top = '0';
    oText.style.zIndex = '1';
    oText.style.opacity = '0';
    this.canvas.parentNode?.appendChild(oText);

    ctx.font = '32px Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(this.title, width / 2, height / 2);

    const { data } = ctx.getImageData(0, 0, width, height);

    let i: number;
    const pixels: AnimationCoordinate[] = [];
    const { width: mainWidth, height: mainHeight } = this;
    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        i = 4 * (y * width + x);
        if (data[i + 3] > 0) {
          pixels.push({
            x: x * 2.5,
            y: y * 2.5,
            speed: getRandom(1, 3),
            fx: getRandom(0, mainWidth),
            fy: getRandom(0, mainHeight),
          });
        }
      }
    }

    return pixels;
  }

  draw() {
    const { ctx, pixels, width, height } = this;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#333';
    let cx: number;
    let cy: number;
    let i = 0;
    pixels.forEach((item) => {
      const { x, y, speed, fx, fy } = item;
      ctx.beginPath();
      cx =
        fx > x
          ? fx - speed >= x
            ? fx - speed
            : x
          : fx + speed <= x
          ? fx + speed
          : x;

      cy =
        fy > y
          ? fy - speed >= y
            ? fy - speed
            : y
          : fy + speed <= y
          ? fy + speed
          : y;

      item.fx = cx;
      item.fy = cy;

      if (fx === x && fy === y) {
        i += 1;
      }

      ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
    if (i < pixels.length) {
      requestAnimationFrame(this.draw.bind(this));
    }
  }
}

export default HeaderCanvas;
