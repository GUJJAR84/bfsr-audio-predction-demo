import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAudioStore from '../store/useAudioStore';

const WaveformVisualizer = () => {
  const canvasRef = useRef(null);
  const { isRecording, analyser, volumeLevel, frequencyRange, recordingTime } = useAudioStore();

  useEffect(() => {
    if (!isRecording || !analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#d4af37';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRecording, analyser]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-army-gold">
        <h2 className="text-2xl font-display font-bold text-army-green-dark flex items-center gap-3">
          <div className="w-1 h-7 bg-army-gold rounded"></div>
          Audio Input Monitoring
        </h2>
      </div>

      {/* Waveform Canvas */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden h-48 mb-4 border-2 border-army-green">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <p className="text-gray-400 text-lg">No audio input detected</p>
          </div>
        )}
      </div>

      {/* Audio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Volume Level"
          value={`${Math.max(-60, Math.round(volumeLevel))} dB`}
          percentage={Math.max(0, Math.min(100, (volumeLevel + 60) / 60 * 100))}
        />
        <MetricCard
          label="Frequency Range"
          value={`${Math.round(frequencyRange)} Hz`}
        />
        <MetricCard
          label="Recording Time"
          value={recordingTime}
        />
      </div>
    </motion.div>
  );
};

const MetricCard = ({ label, value, percentage }) => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-lg border border-army-green/10 shadow-sm">
      <div className="text-xs text-army-green font-semibold uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-2xl font-display font-bold text-army-green-dark">
        {value}
      </div>
      {percentage !== undefined && (
        <div className="mt-2 h-1.5 bg-army-green/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-army-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
};

export default WaveformVisualizer;
