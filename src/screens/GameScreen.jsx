import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const goalVideoRef = useRef(null);
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

  const handleGoalAnimationError = useCallback(() => {
    setShowContinuePrompt(true);
  }, []);

  useEffect(() => {
    if (goalTime === null) {
      return;
    }

    const video = goalVideoRef.current;
    if (!video) {
      return;
    }

    const playVideo = () => {
      video.currentTime = 0;
      return video.play();
    };

    const startPlayback = () => {
      playVideo()?.catch(() => {
        video.muted = true;
        playVideo()?.catch(() => {
          setShowContinuePrompt(true);
        });
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback();
      return;
    }

    video.addEventListener('canplay', startPlayback, { once: true });
    video.load();

    return () => {
      video.removeEventListener('canplay', startPlayback);
    };
  }, [goalTime]);

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
          <div
            className="goal-animation-overlay"
            role="button"
            tabIndex={0}
            onClick={handleContinueToResult}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleContinueToResult();
              }
            }}
          >
            <video
              ref={goalVideoRef}
              autoPlay
              className="goal-animation-video"
              playsInline
              preload="auto"
              src={goalAnimation}
              onEnded={handleGoalAnimationEnd}
              onError={handleGoalAnimationError}
              onTimeUpdate={handleGoalAnimationProgress}
            />
            <span className={`goal-animation-continue ${showContinuePrompt ? 'is-visible' : ''}`}>
              Tap to continue
            </span>
          </div>
        ) : null}
      </div>
    </main>
  );
}
