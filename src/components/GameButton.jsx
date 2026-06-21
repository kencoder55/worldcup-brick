import { useCallback, useMemo } from 'react';
import ballKickSound from '../assets/sound/ball_kick.mp3';

export function GameButton({ children, className = '', onClick, ...props }) {
  const buttonClickAudio = useMemo(() => {
    if (typeof Audio === 'undefined') {
      return null;
    }

    const audio = new Audio(ballKickSound);
    audio.volume = 0.85;
    return audio;
  }, []);

  const handleClick = useCallback(
    (event) => {
      if (buttonClickAudio) {
        buttonClickAudio.currentTime = 0;
        void buttonClickAudio.play().catch(() => {});
      }

      onClick?.(event);
    },
    [buttonClickAudio, onClick],
  );

  return (
    <button className={`game-button ${className}`.trim()} type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
