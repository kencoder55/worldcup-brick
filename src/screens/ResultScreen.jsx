import resultBg from '../assets/images/result_bg.png';
import trophyImage from '../assets/images/trophy.png';
import { GameButton } from '../components/GameButton';
import { ScreenShell } from '../components/ScreenShell';
import { useGameStore } from '../store/GameContext';
import { formatTime } from '../utils/formatTime';

export function ResultScreen() {
  const { bestTime, goHome, lastTime, resetBestTime, startGame } = useGameStore();

  const handleResetBestRecord = () => {
    const shouldReset = window.confirm('Reset your best record?');

    if (!shouldReset) {
      return;
    }

    resetBestTime();
  };

  return (
    <ScreenShell className="result-screen">
      <img className="title-bg" src={resultBg} alt="" />
      <div className="ratio-frame result-frame">
        <section className="result-panel">
          <img className="result-trophy" src={trophyImage} alt="Champion trophy" />
          <div className="result-card">
            <p>RECORDS</p>
            <div className="result-record">{formatTime(lastTime)}</div>
            <span>BEST RECORDS</span>
            <div className="result-best-record">{bestTime ? formatTime(bestTime) : '--:--'}</div>
            <button type="button" className="result-reset-button" onClick={handleResetBestRecord}>
              RESET BEST RECORD
            </button>
          </div>
        </section>
        <div className="result-actions">
          <GameButton className="game-button result-play-button" onClick={startGame}>
            PLAY AGAIN
          </GameButton>
          <GameButton className="game-button result-home-button" onClick={goHome}>
            HOME
          </GameButton>
        </div>
      </div>
    </ScreenShell>
  );
}
