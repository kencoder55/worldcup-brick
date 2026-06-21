export const SCREENS = {
  TITLE: 'title',
  GAME: 'game',
  RESULT: 'result',
};

export const GAME_WIDTH = 576;
export const GAME_HEIGHT = 1024;

export const ASSETS = {
  ball: '/src/assets/images/ball.png',
  brickBlue: '/src/assets/images/brick_blue.png',
  brickGreen: '/src/assets/images/brick_green.png',
  brickOrange: '/src/assets/images/brick_orange.png',
  brickYellow: '/src/assets/images/brick_yellow.png',
  gameField: '/src/assets/images/game_field.png',
  goal: '/src/assets/images/soccer_goal.png',
  paddle: '/src/assets/images/paddle.png',
  titleBg: '/src/assets/images/title_bg.png',
  titleDecoration: '/src/assets/images/title_decoration.png',
  title: '/src/assets/images/title_logo.png',
};

export const BALL_PHASE = {
  WAITING_KICKOFF: 'waitingKickoff',
  PLAYING: 'playing',
  BLINKING_AFTER_MISS: 'blinkingAfterMiss',
};

export const GAME_RULES = {
  debugMode: false,
  ballRadius: 20,
  ballSpeed: 500,
  brickGap: 2,
  brickRows: 5,
  brickCols: 9,
  brickWidth: 54.4,
  brickHeight: 31.2,
  brickStartY: 300,
  enemyGoalLine: 156,
  goalCollisionInset: 180,
  playerGoalLine: 1000,
  paddleY: 900,
  paddleWidth: 100,
  paddleHeight: 20,
  sidePadding: 22,
  blinkDurationMs: 3000,
};
