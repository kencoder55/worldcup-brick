import ballImage from '../assets/images/ball.png';
import titleImage from '../assets/images/title_logo.png';
import titleBg from '../assets/images/title_bg.png';
import { GameButton } from '../components/GameButton';
import { ScreenShell } from '../components/ScreenShell';
import { useGameStore } from '../store/GameContext';
import { formatTime } from '../utils/formatTime';

export function TitleScreen() {
  const { bestTime, startGame } = useGameStore();

  return (
    <ScreenShell className="title-screen">
      <img className="title-bg" src={titleBg} alt="" />
      
      <section className="title-card ratio-frame">
        <img className="title-logo" src={titleImage} alt="Goal Break" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}></div>
          
        <GameButton className="title-start-button" onClick={startGame}>
          Play Game
        </GameButton>

        

        <p className="title-best-time">
          Best Time: <strong>{bestTime ? formatTime(bestTime) : '--:--'}</strong>
        </p>
      </section>
    </ScreenShell>
  );
}
