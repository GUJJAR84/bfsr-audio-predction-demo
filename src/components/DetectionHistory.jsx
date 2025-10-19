import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Clock } from 'lucide-react';
import useAudioStore from '../store/useAudioStore';
import { CLASS_NAMES } from '../config/api';

const DetectionHistory = () => {
  const { detectionHistory, clearHistory } = useAudioStore();

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all detection history?')) {
      clearHistory();
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-army-gold">
        <h2 className="text-2xl font-display font-bold text-army-green-dark flex items-center gap-3">
          <div className="w-1 h-7 bg-army-gold rounded"></div>
          Detection History
        </h2>
        {detectionHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 text-army-green hover:bg-army-green/10 rounded-lg transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {detectionHistory.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500"
            >
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No detection history yet</p>
            </motion.div>
          ) : (
            detectionHistory.map((item, index) => (
              <HistoryItem
                key={`${item.timestamp}-${index}`}
                item={item}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HistoryItem = ({ item, index }) => {
  const typeDisplay = CLASS_NAMES[item.type] || item.type.toUpperCase();
  const confidence = Math.round(item.confidence * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border-l-4 border-army-gold hover:shadow-md transition-all cursor-pointer hover:translate-x-1"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-display font-bold text-army-green-dark">
            {typeDisplay}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(item.timestamp).toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: '2-digit',
              month: 'short',
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-green-600">
            {confidence}%
          </div>
          <div className="text-xs text-gray-500 uppercase">Confidence</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetectionHistory;
