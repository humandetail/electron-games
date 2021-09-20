/**
 * setStatus hooks
 */

import { useEffect, useRef, useState } from "react";
import { GameStatus } from "../config/game.config";

export default function useStatus (): [GameStatus, number, (status: GameStatus) => void, () => number] {
  const [status, setStatus] = useState<GameStatus>(GameStatus.free);
  const [counter, setCounter] = useState<number>(999);

  const timer = useRef<any>();

  useEffect(() => {
    timer.current = setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  }, [counter]);

  function handleSetCounter (status: GameStatus) {
    setStatus(status);
    clearTimeout(timer.current);
    if (status === GameStatus.playing) {
      if (counter === 0) {
        setTimeout(() => {
          setCounter(1);
        }, 1000);
      } else {
        setCounter(0);
      }
    }
  }

  function stopAndReturnCounter (): number {
    clearTimeout(timer.current);
    return counter;
  }

  return [
    status,
    counter,
    handleSetCounter,
    stopAndReturnCounter
  ]
}
