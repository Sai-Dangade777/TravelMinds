import React, { useState } from 'react';
import Map from './Map';

function MapModal({ isOpen, onClose, location, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title || location?.name || 'Location'}</h2>
          <button 
            className="p-1 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="h-[500px] w-full">
          <Map 
            locations={location ? [location] : []} 
            center={location ? { lat: parseFloat(location.lat), lng: parseFloat(location.lng) } : null}
            zoom={15}
          />
        </div>
      </div>
    </div>
  );
}

export default MapModal;