import { useCallback, useMemo, useState } from 'react';
import pauseButton from '../assets/images/pause_button.png';
import timeIcon from '../assets/images/time_icon.png';
import ballKickSound from '../assets/sound/ball_kick.mp3';
import goalAnimation from '../assets/video/goal-animation.mp4';
import { GameWorld } from '../game/GameWorld';
import { Stage } from '../game/Stage';
import { useGameStore } from '../store/GameContext';
import { formatTime } from '../utils/formatTime';

export function GameScreen() {
  const { finishGame, goHome } = useGameStore();
  const [elapsed, setElapsed] = useState(0);
  const [goalTime, setGoalTime] = useState(null);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const buttonClickAudio = useMemo(() => {
    if (typeof Audio === 'undefined') {
      return null;
    }

    const audio = new Audio(ballKickSound);
    audio.volume = 0.85;
    return audio;
  }, []);
  const playButtonClickSound = useCallback(() => {
    if (!buttonClickAudio) {
      return;
    }

    buttonClickAudio.currentTime = 0;
    void buttonClickAudio.play().catch(() => {});
  }, [buttonClickAudio]);

  const isGoalAnimationVisible = goalTime !== null;

  const handleGoal = useCallback((time) => {
    setGoalTime(time);
    setShowContinuePrompt(false);
  }, []);

  const handleGoalAnimationProgress = useCallback((event) => {
    if (showContinuePrompt) {
      return;
    }

    const video = event.currentTarget;
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const animationRemaining = video.duration - video.currentTime;
    if (animationRemaining <= 0.85) {
      setShowContinuePrompt(true);
    }
  }, [showContinuePrompt]);

  const handleGoalAnimationEnd = useCallback(() => {
    setShowContinuePrompt(true);
  }, []);

  const handleGoHome = useCallback(() => {
    playButtonClickSound();
    goHome();
  }, [goHome, playButtonClickSound]);

  const handleContinueToResult = useCallback(() => {
    playButtonClickSound();

    if (!showContinuePrompt || goalTime === null) {
      return;
    }

    finishGame(goalTime);
  }, [finishGame, goalTime, playButtonClickSound, showContinuePrompt]);

  return (
    <main className="game-screen">
      <div className="ratio-frame game-frame">
        <header className="game-topbar">
          <div className="hud">
            <div className="hud-readout">
              <img className="hud-icon" src={timeIcon} alt="" aria-hidden="true" />
              <span className="hud-time">{formatTime(elapsed)}</span>
            </div>
          </div>
          <button className="pause-button" type="button" aria-label="Go home" onClick={handleGoHome}>
            <img src={pauseButton} alt="" aria-hidden="true" />
          </button>
        </header>
        <div className="game-shell">
          <Stage>
            <GameWorld onFinish={handleGoal} onTimeChange={setElapsed} />
          </Stage>
        </div>
        {isGoalAnimationVisible ? (
          <button className="goal-animation-overlay" type="button" onClick={handleContinueToResult}>
            <video
              autoPlay
              className="goal-animation-video"
              playsInline
              preload="auto"
              src={goalAnimation}
              onEnded={handleGoalAnimationEnd}
              onTimeUpdate={handleGoalAnimationProgress}
            />
            <span className={`goal-animation-continue ${showContinuePrompt ? 'is-visible' : ''}`}>
              Tap to continue
            </span>
          </button>
        ) : null}
      </div>
    </main>
  );
}
