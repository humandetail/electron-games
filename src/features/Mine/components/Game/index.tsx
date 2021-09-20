import React, { FC, useEffect, useRef } from 'react';
import { GameStatus } from '../../config/game.config';
import GameCanvas from '../../libs/GameCanvas';
import { getClickItemCoordinate, getRightfulItems, isSameItem, getDefaultSize } from '../../libs/utils';
import { IBoxItem, ICoordinate, IOptions } from '../../types';

interface ISetItemProps {
  coordinate: ICoordinate,
  items: IBoxItem[][],
  canvas: GameCanvas,
  type: 'OPEN' | 'ACTIVE' | 'ACTIVE_OPEN' | 'MARK' | 'SUSPICIOUS' | 'DEATH',
  value: boolean
}

const Game: FC<{
  mines: number,
  items: IBoxItem[][],
  status: GameStatus,
  options: IOptions,
  setMines: React.Dispatch<React.SetStateAction<number>>,
  setStatus: (status: GameStatus) => void
}> = ({
  mines,
  items,
  status,
  options,
  setMines,
  setStatus
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaultOptions = getDefaultSize(options);

  useEffect(() => {
    if (items.length === 0 || status !== GameStatus.playing) return;

    const gameItems = JSON.parse(JSON.stringify(items)) as IBoxItem[][];
    let gameCanvas: GameCanvas | null = new GameCanvas(canvasRef.current!, gameItems);
    let flags = mines;

    if (!gameCanvas) return;

    let cachedCoordinate: ICoordinate = {x: -1, y: -1};
    let firstClick: ICoordinate = {x: -1, y: -1};
    let clickTimes = 0; // 记录鼠标点击次数
    let isDblClick = false;

    // 开启周边元素
    function setAroundItemsOpen (x: number, y: number, items: IBoxItem[][], canvas: GameCanvas) {
      if (items[y][x].type === 'OPEN' || items[y][x].type === 'MARK' || items[y][x].type === 'SUSPICIOUS') {
        return;
      }
      setSingleItem({
        coordinate: { x, y },
        type: 'OPEN',
        value: true,
        items,
        canvas
      })
    }

    function setAroundItems({
      coordinate,
      type,
      value,
      items,
      canvas
    }: ISetItemProps) {
      const rightfulItems = getRightfulItems(coordinate.x, coordinate.y, items)
        .filter(([x, y]) => !(coordinate.x === x && coordinate.y === y));

      if (rightfulItems.length === 0) return;

      if (type === 'OPEN') {
        rightfulItems.forEach(([x, y]) => setAroundItemsOpen(x, y, items, canvas));

        gameCanvas?.draw(items);
      }

      if (type === 'ACTIVE') {
        // 获取周围已经被标记的雷数
        const markCount = rightfulItems.reduce((prev, item) => {
          prev += items[item[1]][item[0]].type === 'MARK' ? 1 : 0;
          return prev;
        }, 0);
        rightfulItems.forEach(([x, y]) => {
          if (items[y][x].type === 'DEFAULT' || items[y][x].type === 'ACTIVE') {
            if (
              items[coordinate.y][coordinate.x].type === 'OPEN' &&
              typeof items[coordinate.y][coordinate.x].value === 'number' &&
              items[coordinate.y][coordinate.x].value <= markCount
            ) {
              setAroundItems({
                coordinate,
                type: 'OPEN',
                value: true,
                items,
                canvas
              })
              // items[y][x].type = 'OPEN';
            } else {
              setSingleItem({
                coordinate: { x, y },
                type: 'ACTIVE',
                value,
                items,
                canvas
              })
              // items[y][x].type = value ? 'ACTIVE' : 'DEFAULT';
            }
          }
        });
      }
    }

    function setSingleItem ({
      coordinate,
      type,
      value,
      items,
      canvas
    }: ISetItemProps) {
      const item = items[coordinate.y][coordinate.x];
      switch (type) {
        case 'ACTIVE':
          if (value) {
            if (item.type === 'DEFAULT') {
              item.type = 'ACTIVE';
            }
          } else {
            item.type = item.type === 'ACTIVE' ? 'DEFAULT' : item.type;
          }
          break;
        case 'OPEN':
          if (item.type !== 'DEFAULT' && item.type !== 'ACTIVE') {
            break;
          }
          if (item.value === 'MINE') {
            // 游戏结束
            item.isDeathItem = true;
          } else if (item.value === 0) {
            item.type = 'OPEN';
            setAroundItems({
              coordinate,
              type: 'OPEN',
              value: true,
              items: gameItems,
              canvas: gameCanvas!
            });
          } else {
            item.type = 'OPEN';
          }
          break;
        case 'MARK':
          if (item.type === 'DEFAULT') {
            if (options.allowSuspicious) {
              item.type = 'SUSPICIOUS';
            } else {
              item.type = 'MARK';
              setMines(--flags);
            }
          } else if (item.type === 'SUSPICIOUS') {
            if (flags > 0) {
              // 可用旗子大于0时，才可以标记雷
              item.type = 'MARK';
              setMines(--flags);
            }
          } else if (item.type === 'MARK') {
            item.type = 'DEFAULT';
            setMines(++flags);
          }
          break;
        default:
          break;
      }

      // 计算游戏是否已经结束
      const isDeath = items.some((row) => {
        return row.some((col) => col.isDeathItem);
      });
      if (isDeath) {
        // 踩中雷了
        // 开启所有未被标记的雷
        items.forEach((row) => {
          row.forEach((col) => {
            if (col.value === 'MINE') {
              col.type = 'OPEN';
            }
          })
        })
        setStatus(GameStatus.failed);
        canvas.draw(gameItems, true);
        return
      }

      canvas.draw(gameItems);

      // 计算剩余旗子和已开启的格子
      let openCount = 0;
      let markCount = 0;
      let allIsMine = true;
      const { width, height, mines } = defaultOptions;

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (items[i][j].type === 'OPEN') {
            openCount += 1;
          }
          if (items[i][j].type === 'MARK') {
            markCount += 1;
            if (items[i][j].value !== 'MINE') {
              allIsMine = false;
            }
          }
        }
      }

      if (markCount === mines && allIsMine) {
        // 旗子已经用完, 且都是雷
        // 理论上游戏结束了，但是这里可以卡bug
      }
      if (openCount === (width * height - mines)) {
        // 游戏成功
        setStatus(GameStatus.successful);
      }
    }

    function onMouseDown (e: MouseEvent) {
      e.preventDefault();

      if (status !== GameStatus.playing) return;

      const coordinate = getClickItemCoordinate(e, canvasRef.current!);

      clickTimes = Math.min(2, clickTimes + 1); // 记录一次点击

      // 非法点击事件
      if (!coordinate) {
        return;
      }

      cachedCoordinate = coordinate;

      switch (e.buttons) {
        case 3:
          isDblClick = true;
          if (isSameItem(firstClick, cachedCoordinate)) {
            setAroundItems({
              coordinate,
              type: 'ACTIVE',
              value: true,
              items: gameItems,
              canvas: gameCanvas!
            });
          }
          break;
        case 2:
          break;
        case 1:
          setSingleItem({
            coordinate,
            type: 'ACTIVE',
            value: true,
            items: gameItems,
            canvas: gameCanvas!
          })
          firstClick = coordinate;
          break;
        default:
          break;
      }
    }

    function onMouseUp (e: MouseEvent) {
      e.preventDefault();

      if (status !== GameStatus.playing) return;

      const upCoordinate = getClickItemCoordinate(e, canvasRef.current!);
      if (!upCoordinate) {
        clickTimes = Math.max(0, clickTimes - 1);
        return;
      }

      if (isDblClick) {
        if (clickTimes >= 2) {
          // 双击
          setAroundItems({
            coordinate: cachedCoordinate,
            type: 'ACTIVE',
            value: false,
            items: gameItems,
            canvas: gameCanvas!
          });
        } else {
          // 单击
          setSingleItem({
            coordinate: cachedCoordinate,
            type: 'ACTIVE',
            value: false,
            items: gameItems,
            canvas: gameCanvas!
          })
          isDblClick = false;
        }
      } else {
        switch (e.button) {
          case 0:
            // 左键抬起
            if (isSameItem(upCoordinate, cachedCoordinate)) {
              setSingleItem({
                coordinate: upCoordinate,
                type: 'OPEN',
                value: false,
                items: gameItems,
                canvas: gameCanvas!
              })
            } else {
              // 恢复active状态
              setSingleItem({
                coordinate: cachedCoordinate,
                type: 'ACTIVE',
                value: false,
                items: gameItems,
                canvas: gameCanvas!
              })
            }
            break;
          case 2:
            // 右键抬起
            if (isSameItem(upCoordinate, cachedCoordinate)) {
              setSingleItem({
                coordinate: upCoordinate,
                type: 'MARK',
                value: true,
                items: gameItems,
                canvas: gameCanvas!
              })
            }
            break;
          default:
            break;
        }
      }

      clickTimes = Math.max(0, clickTimes - 1);
    }

    canvasRef.current?.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);

    // eslint-disable-next-line
    return () => {
      gameCanvas = null;
      canvasRef.current?.removeEventListener('mousedown', onMouseDown, false);
      window.removeEventListener('mouseup', onMouseUp, false);
    }
  }, [items, status])

  return (
    <section className="game-wrapper">
      <canvas ref={ canvasRef } style={{ display: 'block' }} />
    </section>
  );
}

export default Game;
