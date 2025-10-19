// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  WEBSOCKET_URL: 'ws://localhost:5000/ws',
  TIMEOUT: 30000,
};

// Audio Configuration
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  FFT_SIZE: 2048,
  RECORDING_CHUNK_SIZE: 4096,
  MIN_CONFIDENCE: 0.3,
  BUFFER_SIZE: 44100 * 3, // 3 seconds
};

// Prediction Images
export const PREDICTION_IMAGES = {
  tank: 'https://images.unsplash.com/photo-1584469541268-f0e091cb12cc?w=800&q=80',
  pedestrian: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80',
  light_vehicle: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
};

// Class Names
export const CLASS_NAMES = {
  tank: 'TANK',
  pedestrian: 'PEDESTRIAN',
  light_vehicle: 'LIGHT VEHICLE',
};

// Logo URLs
export const LOGO_URLS = {
  mainLogo: 'https://page.gensparksite.com/v1/base64_upload/6ec131626f663ffcd86b235d4c0f649e',
  unitLogo: 'https://page.gensparksite.com/v1/base64_upload/96fdbaa5abf05c0656ba4d10c2438e90',
};
