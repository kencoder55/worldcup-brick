import { extend } from '@pixi/react';
import { Container, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { useMemo } from 'react';
import { useGameLoop } from './useGameLoop';
import { usePixiTextures } from './usePixiTextures';
import { BALL_PHASE, GAME_HEIGHT, GAME_RULES, GAME_WIDTH } from '../utils/constants';

extend({ Container, Sprite, Text });

export function GameWorld({ onFinish, onTimeChange }) {
  const textures = usePixiTextures();
  const { ball, ballAlpha, bricks, launchBall, movePaddle, paddleX, phase } = useGameLoop({
    onFinish,
    onTimeChange,
  });
  const hitArea = useMemo(() => new Rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT), []);

  if (!textures) {
    return null;
  }

  const handlePointerDown = (event) => {
    movePaddle(event.global.x);
    launchBall();
  };
  const goalCollisionWidth = GAME_WIDTH - GAME_RULES.goalCollisionInset * 2;

  return (
    <pixiContainer
      eventMode="static"
      hitArea={hitArea}
      onPointerMove={(event) => movePaddle(event.global.x)}
      onPointerDown={handlePointerDown}
    >
      <pixiSprite texture={textures.gameField} width={GAME_WIDTH} height={GAME_HEIGHT} />

      <pixiSprite
        anchor={0.5}
        height={100}
        texture={textures.goal}
        width={250}
        x={GAME_WIDTH / 2}
        y={150}
      />

      {bricks.map((brick) => (
        <pixiSprite
          height={brick.height}
          key={brick.id}
          texture={textures[brick.textureKey]}
          width={brick.width}
          x={brick.x}
          y={brick.y}
        />
      ))}

      <pixiSprite
        anchor={0.5}
        height={GAME_RULES.paddleHeight}
        texture={textures.paddle}
        width={GAME_RULES.paddleWidth}
        x={paddleX}
        y={GAME_RULES.paddleY}
      />

      <pixiSprite
        alpha={ballAlpha}
        anchor={0.5}
        height={GAME_RULES.ballRadius * 2}
        texture={textures.ball}
        width={GAME_RULES.ballRadius * 2}
        x={ball.x}
        y={ball.y}
      />
      {phase === BALL_PHASE.WAITING_KICKOFF ? (
        <pixiText
          anchor={0.5}
          style={{
            fill: '#ffffff',
            fontFamily: 'Titan One, Inter, sans-serif',
            fontSize: 38,
            stroke: '#0b4f29',
            strokeThickness: 8,
          }}
          text="Tap to kick off"
          x={GAME_WIDTH / 2}
          y={GAME_RULES.paddleY + 70}
        />
      ) : null}

      {GAME_RULES.debugMode ? (
        <>
          <pixiSprite
            alpha={0.25}
            height={GAME_RULES.enemyGoalLine}
            texture={Texture.WHITE}
            tint={0x3ba7ff}
            width={goalCollisionWidth}
            x={GAME_RULES.goalCollisionInset}
            y={0}
          />
          <pixiSprite
            alpha={0.9}
            height={2}
            texture={Texture.WHITE}
            tint={0xff5b5b}
            width={GAME_WIDTH}
            x={0}
            y={GAME_RULES.playerGoalLine}
          />
          <pixiText
            style={{
              fill: '#ffffff',
              fontFamily: 'monospace',
              fontSize: 22,
              stroke: '#000000',
              strokeThickness: 4,
            }}
            text={`ball x:${Math.round(ball.x)} y:${Math.round(ball.y)}`}
            x={16}
            y={GAME_HEIGHT - 42}
          />
        </>
      ) : null}
    </pixiContainer>
  );
}
