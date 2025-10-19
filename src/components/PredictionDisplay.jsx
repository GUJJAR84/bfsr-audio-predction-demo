import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Award } from 'lucide-react';
import useAudioStore from '../store/useAudioStore';
import { PREDICTION_IMAGES, CLASS_NAMES } from '../config/api';

const PredictionDisplay = () => {
  const { currentPrediction } = useAudioStore();

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-army-gold">
        <h2 className="text-2xl font-display font-bold text-army-green-dark flex items-center gap-3">
          <div className="w-1 h-7 bg-army-gold rounded"></div>
          Detection Results
        </h2>
        {currentPrediction && (
          <div className="flex items-center gap-2 px-4 py-2 bg-army-green text-white rounded-lg shadow-sm">
            <Award className="w-4 h-4 text-army-gold" />
            <span className="text-sm font-medium">Confidence:</span>
            <span className="text-lg font-bold text-army-gold">
              {Math.round(currentPrediction.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Results Container */}
      <AnimatePresence mode="wait">
        {!currentPrediction ? (
          <NoResults key="no-results" />
        ) : (
          <PredictionResult key="prediction-result" prediction={currentPrediction} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NoResults = () => (
  <motion.div
    className="flex flex-col items-center justify-center h-96 text-gray-400"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <AlertCircle className="w-20 h-20 mb-4 stroke-1" />
    <p className="text-lg text-gray-600">No detection yet. Start audio monitoring to begin.</p>
  </motion.div>
);

const PredictionResult = ({ prediction }) => {
  const typeDisplay = CLASS_NAMES[prediction.type] || prediction.type.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Prediction Header */}
      <div className="bg-gradient-to-r from-army-green to-army-green-light rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-display font-bold text-army-gold tracking-wider drop-shadow-lg">
            {typeDisplay}
          </h3>
          <span className="text-sm opacity-90">
            {new Date(prediction.timestamp).toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: '2-digit',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Display */}
        <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100 aspect-video">
          <img
            src={PREDICTION_IMAGES[prediction.type]}
            alt={typeDisplay}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-semibold text-lg">Detected: {typeDisplay}</p>
          </div>
        </div>

        {/* Confidence Breakdown */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-display font-semibold text-army-green-dark mb-4">
            Classification Confidence
          </h4>
          
          <ConfidenceBar
            label="Tank"
            value={prediction.tank}
            color="from-army-green to-army-green-light"
          />
          <ConfidenceBar
            label="Pedestrian"
            value={prediction.pedestrian}
            color="from-blue-500 to-blue-400"
          />
          <ConfidenceBar
            label="Light Vehicle"
            value={prediction.light_vehicle}
            color="from-orange-500 to-yellow-400"
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoItem label="Detection Method" value="Audio Analysis" />
        <InfoItem label="Processing Time" value={prediction.processingTime} />
        <InfoItem label="Audio Duration" value={prediction.audioDuration} />
      </div>
    </motion.div>
  );
};

const ConfidenceBar = ({ label, value, color }) => {
  const percentage = Math.round(value * 100);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="font-bold text-army-green font-display">{percentage}%</span>
      </div>
      <div className="h-6 bg-white rounded-lg overflow-hidden shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-army-green font-semibold uppercase tracking-wide">
      {label}
    </span>
    <span className="text-lg font-display font-semibold text-gray-800">
      {value}
    </span>
  </div>
);

export default PredictionDisplay;
