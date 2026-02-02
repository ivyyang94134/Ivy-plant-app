import { useState } from 'react';
import Landing from './components/Landing';
import CameraCapture from './components/CameraCapture';
import Analysis from './components/Analysis';
import Result from './components/Result';
import './App.css';

function App() {
  const [page, setPage] = useState('landing');
  const [image, setImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const startCamera = () => {
    setPage('camera');
  };

  const handleCapture = (imgSrc) => {
    setImage(imgSrc);
    setPage('analysis');
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setPage('result');
  };

  const resetApp = () => {
    setImage(null);
    setAnalysisResult(null);
    setPage('landing');
  };

  return (
    <div className="app-container">
      {page === 'landing' && <Landing onStart={startCamera} />}
      {page === 'camera' && <CameraCapture onCapture={handleCapture} onBack={() => setPage('landing')} />}
      {page === 'analysis' && <Analysis image={image} onComplete={handleAnalysisComplete} />}
      {page === 'result' && <Result image={image} result={analysisResult} onRestart={resetApp} />}
    </div>
  );
}

export default App;
