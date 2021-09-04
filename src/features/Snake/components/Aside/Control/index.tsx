import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import MainButton from './MainButton';
import ModeList from './ModeList';

const Control: FC = () => {
  return (
    <div className="control-wrapper">
      <section className="status-ctrl">
        <MainButton />
      </section>
      <section className="mode-ctrl">
        <ModeList />
      </section>
      <section className="quit-ctrl">
        <div className="quit-btn">
          <Link to="/">&lt; 退出游戏 &gt;</Link>
        </div>
      </section>
    </div>
  );
};

export default Control;
