import React, { FC } from 'react';

const Counter: FC<{ counter: number }> = ({ counter }) => {

  function formatNum (num: number): string[] {
    num %= 1000;
    const numStr = String(num).padStart(3, '0');
    return numStr.split('');
  }

  return (
    <div className="counter">
      {
        formatNum(counter).map((item, index) => (
          <span
            key={ index }
            className={ `item item-${item}` }
          />
        ))
      }
    </div>
  );
}

export default Counter;
