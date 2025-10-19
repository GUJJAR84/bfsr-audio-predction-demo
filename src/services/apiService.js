import axios from 'axios';
import useAudioStore from '../store/useAudioStore';
import { API_CONFIG, AUDIO_CONFIG } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions for Backend Integration

/**
 * Send audio file to backend for prediction
 * @param {Blob} audioBlob - Audio data as blob
 * @returns {Promise} Prediction result
 */
export const sendAudioForPrediction = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  try {
    const response = await apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending audio to backend:', error);
    throw error;
  }
};

/**
 * WebSocket connection for real-time audio streaming
 * @returns {WebSocket} WebSocket instance
 */
export const connectWebSocket = () => {
  const ws = new WebSocket(API_CONFIG.WEBSOCKET_URL);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    useAudioStore.getState().setStatus('active', 'Connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handlePredictionResult(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    useAudioStore.getState().setStatus('error', 'Connection Error');
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
    useAudioStore.getState().setStatus('error', 'Disconnected');
  };
  
  return ws;
};

/**
 * Send audio chunk via WebSocket for real-time prediction
 * @param {WebSocket} ws - WebSocket instance
 * @param {ArrayBuffer} audioData - Audio data as array buffer
 */
export const sendAudioChunk = (ws, audioData) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(audioData);
  }
};

/**
 * Handle prediction result from backend
 * @param {Object} data - Prediction data
 */
const handlePredictionResult = (data) => {
  const store = useAudioStore.getState();
  
  const prediction = {
    type: data.type,
    confidence: data.confidence,
    tank: data.tank || 0,
    pedestrian: data.pedestrian || 0,
    light_vehicle: data.light_vehicle || 0,
    timestamp: data.timestamp || new Date().toISOString(),
    processingTime: data.processingTime || '--',
    audioDuration: data.audioDuration || '--',
  };
  
  store.setCurrentPrediction(prediction);
  store.addToHistory({
    type: prediction.type,
    confidence: prediction.confidence,
    timestamp: prediction.timestamp,
  });
};

/**
 * Simulate prediction for demo purposes
 * Replace this with actual API call in production
 */
export const simulatePrediction = async () => {
  const store = useAudioStore.getState();
  
  return new Promise((resolve) => {
    store.setIsProcessing(true);
    
    setTimeout(() => {
      // Random prediction for demo
      const predictions = [
        {
          type: 'tank',
          confidence: 0.89,
          tank: 0.89,
          pedestrian: 0.07,
          light_vehicle: 0.04,
        },
        {
          type: 'pedestrian',
          confidence: 0.76,
          tank: 0.15,
          pedestrian: 0.76,
          light_vehicle: 0.09,
        },
        {
          type: 'light_vehicle',
          confidence: 0.82,
          tank: 0.12,
          pedestrian: 0.06,
          light_vehicle: 0.82,
        },
      ];
      
      const result = predictions[Math.floor(Math.random() * predictions.length)];
      
      const prediction = {
        ...result,
        timestamp: new Date().toISOString(),
        processingTime: (Math.random() * 0.5 + 0.3).toFixed(2) + 's',
        audioDuration: '3.0s',
      };
      
      handlePredictionResult(prediction);
      store.setIsProcessing(false);
      
      resolve(prediction);
    }, 1500);
  });
};

/**
 * Test backend connection
 */
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
};

/**
 * Get model information from backend
 */
export const getModelInfo = async () => {
  try {
    const response = await apiClient.get('/model/info');
    return response.data;
  } catch (error) {
    console.error('Error getting model info:', error);
    throw error;
  }
};

export default {
  sendAudioForPrediction,
  connectWebSocket,
  sendAudioChunk,
  simulatePrediction,
  testConnection,
  getModelInfo,
};
