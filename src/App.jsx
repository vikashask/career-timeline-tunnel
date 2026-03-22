import MainScene from './scenes/MainScene';
import DetailOverlay from './components/DetailOverlay';
import HUD from './components/HUD';

export default function App() {
  return (
    <div id="app-root" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MainScene />
      <HUD />
      <DetailOverlay />
    </div>
  );
}
