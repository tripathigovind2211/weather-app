import React from 'react';
import { Loader, Cloud, Sun, CloudRain } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping">
            <Cloud className="h-16 w-16 text-white/30 mx-auto" />
          </div>
          <div className="relative">
            <Cloud className="h-16 w-16 text-white mx-auto animate-bounce" />
            <Sun className="h-8 w-8 text-yellow-300 absolute top-2 right-2 animate-spin" />
            <CloudRain className="h-6 w-6 text-blue-300 absolute bottom-0 left-2 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-white">
          <Loader className="h-5 w-5 animate-spin" />
          <span className="text-lg font-medium">Loading weather data...</span>
        </div>
        <p className="text-white/70 mt-2">Fetching the latest weather information</p>
      </div>
    </div>
  );
};