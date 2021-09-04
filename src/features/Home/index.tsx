import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
        </ul>
      </section>
    </div>
  );
};

export default Home;
