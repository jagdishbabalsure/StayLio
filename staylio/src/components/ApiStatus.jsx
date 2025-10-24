import React, { useState, useEffect } from 'react';
import hotelService from '../services/hotelService';

const ApiStatus = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkApiStatus = async () => {
      setIsChecking(true);
      try {
        // Try to fetch hotels to check API connectivity
        const hotels = await hotelService.getAllHotels();
        setIsConnected(hotels.length > 0 && hotels[0].id !== 'fallback-1');
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
          <span className="text-yellow-800 text-sm font-medium">Checking API...</span>
        </div>
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="fixed top-20 right-4 bg-red-100 border border-red-300 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-red-800 text-sm font-medium">API Disconnected</div>
            <div className="text-red-600 text-xs">Check localhost:8081</div>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected === true) {
    return (
      <div className="fixed top-20 right-4 bg-green-100 border border-green-300 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 text-sm font-medium">API Connected</span>
        </div>
      </div>
    );
  }

  return null;
};

export default ApiStatus;