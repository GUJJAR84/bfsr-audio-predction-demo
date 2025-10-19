import { create } from 'zustand';

const useAudioStore = create((set, get) => ({
  // Recording state
  isRecording: false,
  audioContext: null,
  analyser: null,
  microphone: null,
  animationId: null,
  recordingStartTime: null,
  
  // Audio metrics
  volumeLevel: 0,
  frequencyRange: 0,
  recordingTime: '00:00',
  
  // Prediction state
  currentPrediction: null,
  isProcessing: false,
  
  // History
  detectionHistory: [],
  
  // Status
  status: 'ready',
  statusText: 'Ready',
  
  // Actions
  setIsRecording: (value) => set({ isRecording: value }),
  setAudioContext: (context) => set({ audioContext: context }),
  setAnalyser: (analyser) => set({ analyser: analyser }),
  setMicrophone: (microphone) => set({ microphone: microphone }),
  setAnimationId: (id) => set({ animationId: id }),
  setRecordingStartTime: (time) => set({ recordingStartTime: time }),
  
  setVolumeLevel: (level) => set({ volumeLevel: level }),
  setFrequencyRange: (range) => set({ frequencyRange: range }),
  setRecordingTime: (time) => set({ recordingTime: time }),
  
  setCurrentPrediction: (prediction) => set({ currentPrediction: prediction }),
  setIsProcessing: (value) => set({ isProcessing: value }),
  
  setStatus: (status, text) => set({ status, statusText: text }),
  
  addToHistory: (prediction) => {
    const history = get().detectionHistory;
    const newHistory = [prediction, ...history].slice(0, 20);
    set({ detectionHistory: newHistory });
    
    // Save to localStorage
    try {
      localStorage.setItem('detectionHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  },
  
  clearHistory: () => {
    set({ detectionHistory: [] });
    try {
      localStorage.removeItem('detectionHistory');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },
  
  loadHistory: () => {
    try {
      const saved = localStorage.getItem('detectionHistory');
      if (saved) {
        set({ detectionHistory: JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  },
  
  resetAudioState: () => {
    const state = get();
    
    // Stop all audio tracks
    if (state.microphone && state.microphone.mediaStream) {
      state.microphone.mediaStream.getTracks().forEach(track => track.stop());
    }
    
    // Close audio context
    if (state.audioContext) {
      state.audioContext.close();
    }
    
    // Stop animation
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
    }
    
    set({
      isRecording: false,
      audioContext: null,
      analyser: null,
      microphone: null,
      animationId: null,
      recordingStartTime: null,
      volumeLevel: 0,
      frequencyRange: 0,
      recordingTime: '00:00',
    });
  },
}));

export default useAudioStore;
