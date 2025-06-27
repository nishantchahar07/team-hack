'use client'

import React from 'react';

interface EmergencyOverlayProps {
  isActive: boolean;
  onDeactivate: () => void;
}

const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ isActive, onDeactivate }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600/95 to-red-500/95 backdrop-blur-md z-50 flex items-center justify-center text-white text-center emergency-overlay">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
          <i className="fas fa-exclamation-triangle"></i> EMERGENCY MODE
        </h1>
        <p className="text-2xl mb-8 drop-shadow">
          Emergency services have been activated. Help is on the way. Stay calm and follow the instructions below.
        </p>

        <div className="flex flex-wrap gap-5 justify-center">
          <button className="bg-white/20 border-2 border-white text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
            <i className="fas fa-phone"></i>
            Call 108
          </button>
          <button className="bg-white/20 border-2 border-white text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
            <i className="fas fa-map-marker-alt"></i>
            Share Location
          </button>
          <button className="bg-white/20 border-2 border-white text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
            <i className="fas fa-user-md"></i>
            Contact Doctor
          </button>
          <button
            onClick={onDeactivate}
            className="bg-white/90 text-red-600 px-6 py-4 rounded-full text-lg font-semibold hover:bg-white transition-all duration-300 flex items-center gap-3"
          >
            <i className="fas fa-times"></i>
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyOverlay;
