import { Application } from '@pixi/react';
import { GAME_HEIGHT, GAME_WIDTH } from '../utils/constants';

export function Stage({ children }) {
  return (
    <Application
      antialias
      autoDensity
      backgroundAlpha={0}
      height={GAME_HEIGHT}
      resolution={Math.min(window.devicePixelRatio || 1, 2)}
      width={GAME_WIDTH}
    >
      {children}
    </Application>
  );
}
