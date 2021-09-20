import React from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer  } from 'electron';

const Home = () => {
  function handleClick () {
    ipcRenderer.send('open-mine-window', { a: 1 });
  }

  return (
    <div className="page-home">
      <header className="header">
        <h1 className="title">Game Center</h1>
      </header>

      <section className="games-wrapper">
        <ul className="list">
          <li className="item">
            <Link to="/snake">贪吃蛇</Link>
          </li>
          <li className="item">
            <button onClick={ handleClick }>扫雷</button>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
