import { useCallback, useMemo, useRef, useState } from 'react';
import { useTick } from '@pixi/react';
import { createBricks } from './createBricks';
import { circleIntersectsRect, clamp, normalizeVelocity } from './collision';
import { BALL_PHASE, GAME_HEIGHT, GAME_RULES, GAME_WIDTH } from '../utils/constants';
import impact001 from '../assets/sound/impact_001.ogg';
import impact002 from '../assets/sound/impact_002.ogg';
import impact003 from '../assets/sound/impact_003.ogg';
import impact004 from '../assets/sound/impact_004.ogg';
import ballKickSound from '../assets/sound/ball_kick.mp3';
import kickoffSound from '../assets/sound/kickoff.mp3';

function getBallRestY() {
  return GAME_RULES.paddleY - GAME_RULES.paddleHeight / 2 - GAME_RULES.ballRadius;
}

function createRestingBall(paddleX) {
  return {
    x: paddleX,
    y: getBallRestY(),
    vx: 0,
    vy: 0,
  };
}

function createLaunchedBall(paddleX) {
  return {
    x: paddleX,
    y: getBallRestY(),
    vx: 130,
    vy: -GAME_RULES.ballSpeed,
  };
}

function createInitialState() {
  const paddleX = GAME_WIDTH / 2;

  return {
    ball: createRestingBall(paddleX),
    ballAlpha: 1,
    blinkStartTime: 0,
    bricks: createBricks(),
    paddleX,
    phase: BALL_PHASE.WAITING_KICKOFF,
  };
}

export function useGameLoop({ onFinish, onTimeChange }) {
  const [state, setState] = useState(createInitialState);
  const playTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const finishedRef = useRef(false);
  const kickoffAudio = useMemo(() => {
    if (typeof Audio === 'undefined') {
      return null;
    }

    const audio = new Audio(kickoffSound);
    audio.volume = 0.8;
    return audio;
  }, []);
  const brickImpactAudios = useMemo(() => {
    if (typeof Audio === 'undefined') {
      return [];
    }

    return [impact001, impact002, impact003, impact004].map((src) => {
      const audio = new Audio(src);
      audio.volume = 0.75;
      return audio;
    });
  }, []);
  const paddleImpactAudio = useMemo(() => {
    if (typeof Audio === 'undefined') {
      return null;
    }

    const audio = new Audio(ballKickSound);
    audio.volume = 0.85;
    return audio;
  }, []);

  const playSound = useCallback((audio) => {
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }, []);

  const playKickoffSound = useCallback(() => {
    playSound(kickoffAudio);
  }, [kickoffAudio, playSound]);

  const playBrickImpactSound = useCallback(() => {
    if (!brickImpactAudios.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * brickImpactAudios.length);
    playSound(brickImpactAudios[randomIndex]);
  }, [brickImpactAudios, playSound]);
  const playPaddleImpactSound = useCallback(() => {
    playSound(paddleImpactAudio);
  }, [paddleImpactAudio, playSound]);

  const movePaddle = useCallback((x) => {
    setState((current) => {
      const paddleX = clamp(
        x,
        GAME_RULES.sidePadding + GAME_RULES.paddleWidth / 2,
        GAME_WIDTH - GAME_RULES.sidePadding - GAME_RULES.paddleWidth / 2,
      );

      if (current.phase === BALL_PHASE.PLAYING) {
        return { ...current, paddleX };
      }

      return {
        ...current,
        paddleX,
        ball: createRestingBall(paddleX),
      };
    });
  }, []);

  const launchBall = useCallback(() => {
    setState((current) => {
      if (current.phase !== BALL_PHASE.WAITING_KICKOFF) {
        return current;
      }

      playKickoffSound();

      return {
        ...current,
        ball: createLaunchedBall(current.paddleX),
        phase: BALL_PHASE.PLAYING,
      };
    });
  }, [playKickoffSound]);

  useTick((ticker) => {
    if (finishedRef.current) {
      return;
    }

    const dt = Math.min(ticker.deltaMS / 1000, 0.033);

    setState((current) => {
      if (current.phase === BALL_PHASE.BLINKING_AFTER_MISS) {
        const blinkElapsed = performance.now() - current.blinkStartTime;
        const blinkVisible = Math.floor(blinkElapsed / 250) % 2 === 0;

        if (blinkElapsed >= GAME_RULES.blinkDurationMs) {
          return {
            ...current,
            ball: createRestingBall(current.paddleX),
            ballAlpha: 1,
            phase: BALL_PHASE.WAITING_KICKOFF,
          };
        }

        return {
          ...current,
          ball: createRestingBall(current.paddleX),
          ballAlpha: blinkVisible ? 1 : 0.25,
        };
      }

      if (current.phase === BALL_PHASE.WAITING_KICKOFF) {
        return current;
      }

      playTimeRef.current += dt;
      elapsedRef.current = playTimeRef.current;
      onTimeChange(playTimeRef.current);

      let ball = {
        ...current.ball,
        x: current.ball.x + current.ball.vx * dt,
        y: current.ball.y + current.ball.vy * dt,
      };
      let bricks = current.bricks;

      if (ball.x - GAME_RULES.ballRadius <= GAME_RULES.sidePadding) {
        ball.x = GAME_RULES.sidePadding + GAME_RULES.ballRadius;
        ball.vx = Math.abs(ball.vx);
      }

      if (ball.x + GAME_RULES.ballRadius >= GAME_WIDTH - GAME_RULES.sidePadding) {
        ball.x = GAME_WIDTH - GAME_RULES.sidePadding - GAME_RULES.ballRadius;
        ball.vx = -Math.abs(ball.vx);
      }

      const inEnemyGoal =
        ball.x > GAME_RULES.goalCollisionInset &&
        ball.x < GAME_WIDTH - GAME_RULES.goalCollisionInset;
      if (ball.y - GAME_RULES.ballRadius <= GAME_RULES.enemyGoalLine) {
        if (inEnemyGoal) {
          finishedRef.current = true;
          onFinish(elapsedRef.current);
          return current;
        }

        ball.y = GAME_RULES.enemyGoalLine + GAME_RULES.ballRadius;
        ball.vy = Math.abs(ball.vy);
      }

      const paddleRect = {
        x: current.paddleX - GAME_RULES.paddleWidth / 2,
        y: GAME_RULES.paddleY - GAME_RULES.paddleHeight / 2,
        width: GAME_RULES.paddleWidth,
        height: GAME_RULES.paddleHeight,
      };

      if (ball.vy > 0 && circleIntersectsRect({ ...ball, radius: GAME_RULES.ballRadius }, paddleRect)) {
        playPaddleImpactSound();
        const offset = (ball.x - current.paddleX) / (GAME_RULES.paddleWidth / 2);
        const nextVelocity = normalizeVelocity(offset * 320, -GAME_RULES.ballSpeed, GAME_RULES.ballSpeed);
        ball = {
          ...ball,
          y: paddleRect.y - GAME_RULES.ballRadius,
          ...nextVelocity,
        };
      }

      if (ball.y + GAME_RULES.ballRadius >= GAME_RULES.playerGoalLine) {
        return {
          ...current,
          ball: createRestingBall(current.paddleX),
          ballAlpha: 1,
          blinkStartTime: performance.now(),
          phase: BALL_PHASE.BLINKING_AFTER_MISS,
        };
      }

      const hitBrick = bricks.find((brick) =>
        circleIntersectsRect({ ...ball, radius: GAME_RULES.ballRadius }, brick),
      );

      if (hitBrick) {
        bricks = bricks.filter((brick) => brick.id !== hitBrick.id);
        playBrickImpactSound();

        const brickCenterX = hitBrick.x + hitBrick.width / 2;
        const brickCenterY = hitBrick.y + hitBrick.height / 2;
        const dx = Math.abs(ball.x - brickCenterX) / (hitBrick.width / 2);
        const dy = Math.abs(ball.y - brickCenterY) / (hitBrick.height / 2);

        if (dx > dy) {
          ball.vx *= -1;
        } else {
          ball.vy *= -1;
        }
      }

      return {
        ...current,
        ball,
        ballAlpha: 1,
        bricks,
      };
    });
  });

  return {
    ...state,
    elapsed: elapsedRef.current,
    launchBall,
    movePaddle,
  };
}
