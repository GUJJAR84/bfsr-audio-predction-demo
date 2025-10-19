import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Activity } from 'lucide-react';
import useAudioStore from '../store/useAudioStore';
import { startAudioRecording, stopAudioRecording } from '../services/audioService';

const AudioControls = () => {
  const [audioSource, setAudioSource] = useState('microphone');
  const { isRecording, status, statusText } = useAudioStore();

  const handleStart = async () => {
    try {
      await startAudioRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const handleStop = () => {
    stopAudioRecording();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Status Indicator */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-semibold text-army-green-dark">
          Audio Controls
        </h3>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <motion.div
            className={`w-3 h-3 rounded-full ${getStatusColor()}`}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm font-semibold text-gray-700">{statusText}</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="space-y-4">
        {/* Audio Source Selection */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-army-green-dark whitespace-nowrap">
            Audio Source:
          </label>
          <select
            value={audioSource}
            onChange={(e) => setAudioSource(e.target.value)}
            disabled={isRecording}
            className="flex-1 px-4 py-2 border-2 border-army-green-light rounded-lg bg-white text-gray-700 font-medium cursor-pointer transition-all hover:border-army-gold focus:border-army-gold focus:outline-none focus:ring-2 focus:ring-army-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="microphone">Microphone</option>
            <option value="line-in">Line In / Audio Jack</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleStart}
            disabled={isRecording}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-army-green to-army-green-light text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            whileHover={!isRecording ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isRecording ? { scale: 0.98 } : {}}
          >
            <Mic className="w-5 h-5" />
            Start Detecting
          </motion.button>

          <motion.button
            onClick={handleStop}
            disabled={!isRecording}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-army-red text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            whileHover={isRecording ? { scale: 1.02, y: -2 } : {}}
            whileTap={isRecording ? { scale: 0.98 } : {}}
          >
            <Square className="w-5 h-5" />
            Stop Detection
          </motion.button>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Activity className="w-5 h-5 text-red-600 animate-pulse" />
          <span className="text-sm font-medium text-red-800">
            Recording in progress... Audio is being analyzed in real-time.
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AudioControls;
