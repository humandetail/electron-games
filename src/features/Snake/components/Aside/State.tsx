import React, { FC, useContext } from 'react';

import { SnakeContext } from '../../views/Snake';
import DigitalAnimation, { base } from '../common/DigitalAnimation';

const formatScore = (function () {
  let cache = 0;
  return function (score: number) {
    const cacheMap = cache.toString().padStart(5, '0').split('');

    const arr = score
      .toString()
      .padStart(5, '0')
      .split('')
      .map((item, index) => {
        return {
          prev: +cacheMap[index],
          value: +item,
        };
      });
    cache = score;
    return arr;
  };
})();

const State: FC = () => {
  const { mode, status, score } = useContext(SnakeContext);

  return (
    <div className="state-wrapper">
      <div className="row">
        <div className="label">游戏状态：</div>
        <div className="value">{status}</div>
      </div>
      <div className="row">
        <div className="label">当前难度：</div>
        <div className="value">{mode}</div>
      </div>
      <div className="row">
        <div className="label">游戏得分：</div>
        <div className="value">
          {formatScore(score).map((item, index) => (
            <DigitalAnimation
              key={index}
              prev={item.prev}
              value={item.value}
              delay={0}
              step={Math.abs(item.value - item.prev)}
              duration={base}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default State;
