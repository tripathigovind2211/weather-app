import React from 'react';
import { Leaf, AlertTriangle, Activity } from 'lucide-react';
import type { AirPollutionData } from '../types/weather';

interface AirQualityProps {
  data: AirPollutionData;
}

export const AirQuality: React.FC<AirQualityProps> = ({ data }) => {
  const currentData = data.list[0];
  
  const getAQILevel = (aqi: number) => {
    const levels = [
      { level: 1, label: 'Good', color: 'text-green-400', bgColor: 'bg-green-400/20', icon: Leaf },
      { level: 2, label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', icon: Leaf },
      { level: 3, label: 'Moderate', color: 'text-orange-400', bgColor: 'bg-orange-400/20', icon: AlertTriangle },
      { level: 4, label: 'Poor', color: 'text-red-400', bgColor: 'bg-red-400/20', icon: AlertTriangle },
      { level: 5, label: 'Very Poor', color: 'text-purple-400', bgColor: 'bg-purple-400/20', icon: Activity },
    ];
    return levels.find(l => l.level === aqi) || levels[0];
  };

  const aqiLevel = getAQILevel(currentData.main.aqi);
  const IconComponent = aqiLevel.icon;

  const pollutants = [
    { name: 'PM2.5', value: currentData.components.pm2_5, unit: 'μg/m³', description: 'Fine particles' },
    { name: 'PM10', value: currentData.components.pm10, unit: 'μg/m³', description: 'Coarse particles' },
    { name: 'NO₂', value: currentData.components.no2, unit: 'μg/m³', description: 'Nitrogen dioxide' },
    { name: 'O₃', value: currentData.components.o3, unit: 'μg/m³', description: 'Ozone' },
    { name: 'SO₂', value: currentData.components.so2, unit: 'μg/m³', description: 'Sulfur dioxide' },
    { name: 'CO', value: currentData.components.co, unit: 'μg/m³', description: 'Carbon monoxide' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-6 w-6 text-white" />
        <h3 className="text-2xl font-bold text-white">Air Quality Index</h3>
      </div>

      {/* AQI Main Display */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${aqiLevel.bgColor} mb-4`}>
          <IconComponent className={`h-8 w-8 ${aqiLevel.color}`} />
          <div>
            <div className="text-white text-3xl font-bold">{currentData.main.aqi}</div>
            <div className={`text-lg font-semibold ${aqiLevel.color}`}>{aqiLevel.label}</div>
          </div>
        </div>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Air quality is based on the concentration of harmful particles and gases in the atmosphere.
        </p>
      </div>

      {/* Pollutant Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => (
          <div 
            key={pollutant.name}
            className="bg-white/10 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white font-semibold text-lg mb-1">{pollutant.name}</div>
            <div className="text-white text-2xl font-bold mb-1">
              {pollutant.value.toFixed(1)}
            </div>
            <div className="text-white/60 text-xs">{pollutant.unit}</div>
            <div className="text-white/80 text-xs mt-2">{pollutant.description}</div>
          </div>
        ))}
      </div>

      {/* AQI Scale */}
      <div className="mt-8">
        <h4 className="text-white font-semibold mb-4">AQI Scale</h4>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((level) => {
            const levelInfo = getAQILevel(level);
            const LevelIcon = levelInfo.icon;
            return (
              <div 
                key={level}
                className={`p-3 rounded-lg text-center ${levelInfo.bgColor} ${
                  level === currentData.main.aqi ? 'ring-2 ring-white' : ''
                }`}
              >
                <LevelIcon className={`h-4 w-4 mx-auto mb-1 ${levelInfo.color}`} />
                <div className="text-white text-sm font-semibold">{level}</div>
                <div className={`text-xs ${levelInfo.color}`}>{levelInfo.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};