import { createContext, useContext, useMemo, useState } from 'react';
import { SCREENS } from '../utils/constants';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.TITLE);
  const [lastTime, setLastTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const saved = window.localStorage.getItem('goal-break-best-time');
    return saved ? Number(saved) : 0;
  });

  const startGame = () => setScreen(SCREENS.GAME);
  const goHome = () => setScreen(SCREENS.TITLE);

  const finishGame = (time) => {
    setLastTime(time);
    setBestTime((currentBest) => {
      const nextBest = currentBest === 0 ? time : Math.min(currentBest, time);
      window.localStorage.setItem('goal-break-best-time', String(nextBest));
      return nextBest;
    });
    setScreen(SCREENS.RESULT);
  };

  const resetBestTime = () => {
    setBestTime(0);
    window.localStorage.removeItem('goal-break-best-time');
  };

  const value = useMemo(
    () => ({
      bestTime,
      finishGame,
      goHome,
      lastTime,
      resetBestTime,
      screen,
      startGame,
    }),
    [bestTime, lastTime, screen],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameStore() {
  const store = useContext(GameContext);

  if (!store) {
    throw new Error('useGameStore must be used within GameProvider');
  }

  return store;
}
