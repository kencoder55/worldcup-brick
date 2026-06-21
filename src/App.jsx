import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TitleScreen } from './screens/TitleScreen';
import { GameProvider, useGameStore } from './store/GameContext';
import { SCREENS } from './utils/constants';
import './styles.css';

function ScreenRouter() {
  const { screen } = useGameStore();

  if (screen === SCREENS.GAME) {
    return <GameScreen />;
  }

  if (screen === SCREENS.RESULT) {
    return <ResultScreen />;
  }

  return <TitleScreen />;
}

export default function App() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  );
}
