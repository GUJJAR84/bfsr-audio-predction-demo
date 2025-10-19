import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import useAudioStore from '../store/useAudioStore';

const LoadingOverlay = () => {
  const { isProcessing } = useAudioStore();

  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-army-gold animate-spin" />
            <p className="text-white text-xl font-semibold">Processing Audio...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
