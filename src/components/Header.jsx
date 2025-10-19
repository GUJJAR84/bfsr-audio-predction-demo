import React from 'react';
import { motion } from 'framer-motion';
import { LOGO_URLS } from '../config/api';

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-army-green-dark to-army-green shadow-2xl sticky top-0 z-50 border-b-4 border-army-gold">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-4 items-center">
          {/* Main Logo */}
          <motion.div
            className="hidden md:flex flex-col items-center gap-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-28 h-28 bg-white/10 rounded-xl p-3 flex items-center justify-center border-2 border-army-gold shadow-lg hover:scale-105 transition-transform">
              <img
                src={LOGO_URLS.mainLogo}
                alt="Main Army Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-army-gold text-xs font-semibold uppercase tracking-wider">
              Main Logo
            </span>
          </motion.div>

          {/* Center Title */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-army-gold tracking-[0.2em] drop-shadow-lg">
              DORJE BFSR
            </h1>
            <p className="text-white text-sm md:text-base lg:text-lg font-medium tracking-[0.15em] uppercase mt-2">
              Battlefield Surveillance & Recognition System
            </p>
          </motion.div>

          {/* Unit Logo */}
          <motion.div
            className="hidden md:flex flex-col items-center gap-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-28 h-28 bg-white/10 rounded-xl p-3 flex items-center justify-center border-2 border-army-gold shadow-lg hover:scale-105 transition-transform">
              <img
                src={LOGO_URLS.unitLogo}
                alt="Unit Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-army-gold text-xs font-semibold uppercase tracking-wider">
              Unit Logo
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
