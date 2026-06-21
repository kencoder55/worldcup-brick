import { GAME_WIDTH, GAME_RULES } from '../utils/constants';

const BRICK_TEXTURES = ['brickOrange', 'brickOrange', 'brickYellow', 'brickGreen', 'brickBlue'];

export function createBricks() {
  const rowWidth =
    GAME_RULES.brickCols * GAME_RULES.brickWidth + (GAME_RULES.brickCols - 1) * GAME_RULES.brickGap;
  const startX = (GAME_WIDTH - rowWidth) / 2;

  return Array.from({ length: GAME_RULES.brickRows * GAME_RULES.brickCols }, (_, index) => {
    const row = Math.floor(index / GAME_RULES.brickCols);
    const col = index % GAME_RULES.brickCols;

    return {
      id: `${row}-${col}`,
      textureKey: BRICK_TEXTURES[row],
      x: startX + col * (GAME_RULES.brickWidth + GAME_RULES.brickGap),
      y: GAME_RULES.brickStartY + row * (GAME_RULES.brickHeight + GAME_RULES.brickGap),
      width: GAME_RULES.brickWidth,
      height: GAME_RULES.brickHeight,
    };
  });
}
