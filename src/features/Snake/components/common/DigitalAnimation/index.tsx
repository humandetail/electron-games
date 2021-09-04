import React, { FC, useEffect, useState } from 'react';

import styles from './index.scss';
import { sleep } from './utils';

export interface IDigitalAnimationProps {
  prev?: number;
  value?: number;
  delay?: number;
  step?: number;
  duration?: number;
}

export const base = 20;

const DigitalAnimation: FC<IDigitalAnimationProps> = ({
  prev = 0,
  value = 0,
  delay = base,
  step = 1,
  duration = base,
} = {}) => {
  const [posY, setPosY] = useState(prev * base);
  useEffect(() => {
    let i = 1;
    let y = posY;
    let timer: number;
    setPosY(prev * base);

    const run = () => {
      i++;

      if (i >= duration) {
        setPosY(value * base);
      } else {
        y += step;

        if (y >= base * 10) {
          y = 0;
        }

        setPosY(y);

        timer = requestAnimationFrame(run);
      }
    };

    sleep(delay).then(() => run());

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [prev, value, delay, step, duration]);
  return (
    <div className={styles.digit}>
      <div
        className={styles.container}
        style={{ transform: `translateY(-${posY}px)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
          return <i key={item}>{item}</i>;
        })}
        <i>0</i>
      </div>
    </div>
  );
};

export default DigitalAnimation;
