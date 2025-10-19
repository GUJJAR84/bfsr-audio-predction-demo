import useAudioStore from '../store/useAudioStore';
import { AUDIO_CONFIG } from '../config/api';
import { simulatePrediction } from './apiService';

let recordingInterval = null;

export const startAudioRecording = async () => {
  const store = useAudioStore.getState();
  
  try {
    store.setStatus('active', 'Initializing...');
    
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    
    // Setup Audio Context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = AUDIO_CONFIG.FFT_SIZE;
    
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    
    // Store audio components
    store.setAudioContext(audioContext);
    store.setAnalyser(analyser);
    store.setMicrophone(microphone);
    store.setIsRecording(true);
    store.setRecordingStartTime(Date.now());
    
    store.setStatus('active', 'Recording...');
    
    // Start recording timer
    startRecordingTimer();
    
    // Start audio metrics update
    startAudioMetrics(analyser, audioContext);
    
    // Start prediction simulation (replace with real API call)
    setTimeout(() => {
      if (store.isRecording) {
        startPredictionLoop();
      }
    }, 3000);
    
  } catch (error) {
    console.error('Error starting recording:', error);
    store.setStatus('error', 'Error: ' + error.message);
    throw error;
  }
};

export const stopAudioRecording = () => {
  const store = useAudioStore.getState();
  
  // Stop recording timer
  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }
  
  // Reset audio state
  store.resetAudioState();
  store.setStatus('ready', 'Stopped');
};

const startRecordingTimer = () => {
  const store = useAudioStore.getState();
  
  recordingInterval = setInterval(() => {
    const startTime = store.recordingStartTime;
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    store.setRecordingTime(
      `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    );
  }, 100);
};

const startAudioMetrics = (analyser, audioContext) => {
  const store = useAudioStore.getState();
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
  const updateMetrics = () => {
    if (!store.isRecording) return;
    
    // Get time domain data for volume
    analyser.getByteTimeDomainData(dataArray);
    
    // Calculate volume level (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const db = 20 * Math.log10(rms);
    
    store.setVolumeLevel(db);
    
    // Get frequency data
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    
    // Find dominant frequency
    let maxValue = 0;
    let maxIndex = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }
    
    const frequency = maxIndex * audioContext.sampleRate / AUDIO_CONFIG.FFT_SIZE;
    store.setFrequencyRange(frequency);
    
    // Continue updating
    if (store.isRecording) {
      requestAnimationFrame(updateMetrics);
    }
  };
  
  updateMetrics();
};

const startPredictionLoop = () => {
  const store = useAudioStore.getState();
  
  const runPrediction = async () => {
    if (!store.isRecording) return;
    
    try {
      await simulatePrediction();
      
      // Continue predictions every 5 seconds
      if (store.isRecording) {
        setTimeout(runPrediction, 5000);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };
  
  runPrediction();
};

// Function to capture audio blob for backend
export const captureAudioBlob = async (duration = 3000) => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          stream.getTracks().forEach(track => track.stop());
          resolve(audioBlob);
        };
        
        mediaRecorder.start();
        
        setTimeout(() => {
          mediaRecorder.stop();
        }, duration);
      })
      .catch(reject);
  });
};
