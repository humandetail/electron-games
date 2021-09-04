import React, { FC, useEffect, useRef } from 'react';

import HeaderCanvas from '../../libs/canvas/HeaderCanvas';

const Header: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const oCanvas = canvasRef.current!;

    new HeaderCanvas(oCanvas, 'Snake');
  }, []);

  return (
    <header className="header">
      <canvas ref={canvasRef} width="310" height="180" />
    </header>
  );
};

export default Header;
