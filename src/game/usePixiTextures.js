import { useEffect, useState } from 'react';
import { Assets } from 'pixi.js';
import ball from '../assets/images/ball.png';
import brickBlue from '../assets/images/brick_blue.png';
import brickGreen from '../assets/images/brick_green.png';
import brickOrange from '../assets/images/brick_orange.png';
import brickYellow from '../assets/images/brick_yellow.png';
import gameField from '../assets/images/game_field.png';
import soccerGoal from '../assets/images/soccer_goal.png';
import paddle from '../assets/images/paddle.png';

const ASSET_SOURCES = {
  ball,
  brickBlue,
  brickGreen,
  brickOrange,
  brickYellow,
  gameField,
  soccerGoal,
  paddle,
};

export function usePixiTextures() {
  const [textures, setTextures] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTextures() {
      const sources = Object.values(ASSET_SOURCES);
      const loaded = await Assets.load(sources);

      if (cancelled) {
        return;
      }

      setTextures({
        ball: loaded[ball],
        brickBlue: loaded[brickBlue],
        brickGreen: loaded[brickGreen],
        brickOrange: loaded[brickOrange],
        brickYellow: loaded[brickYellow],
        gameField: loaded[gameField],
        goal: loaded[soccerGoal],
        paddle: loaded[paddle],
      });
    }

    loadTextures().catch((error) => {
      console.error('Failed to load Pixi textures', error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return textures;
}
