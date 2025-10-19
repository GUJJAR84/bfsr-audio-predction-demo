import { useEffect } from 'react';
import Header from './components/Header';
import WaveformVisualizer from './components/WaveformVisualizer';
import AudioControls from './components/AudioControls';
import PredictionDisplay from './components/PredictionDisplay';
import DetectionHistory from './components/DetectionHistory';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import useAudioStore from './store/useAudioStore';

function App() {
  const { loadHistory } = useAudioStore();

  useEffect(() => {
    // Load history from localStorage on mount
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Waveform Section */}
        <WaveformVisualizer />
        
        {/* Audio Controls */}
        <AudioControls />
        
        {/* Prediction Display */}
        <PredictionDisplay />
        
        {/* Detection History */}
        <DetectionHistory />
      </main>
      
      <Footer />
      <LoadingOverlay />
    </div>
  );
}

export default App;
