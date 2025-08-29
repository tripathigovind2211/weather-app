import React from 'react';
import { Calendar } from 'lucide-react';
import type { ForecastData } from '../types/weather';

interface ForecastProps {
  data: ForecastData;
}

export const Forecast: React.FC<ForecastProps> = ({ data }) => {
  // Group forecast by day and take one entry per day (around noon)
  const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-white" />
        <h3 className="text-2xl font-bold text-white">5-Day Forecast</h3>
      </div>

      <div className="space-y-4">
        {dailyForecasts.map((forecast, index) => (
          <div 
            key={forecast.dt} 
            className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt={forecast.weather[0].description}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-white font-semibold text-lg">
                    {index === 0 ? 'Today' : formatDate(forecast.dt)}
                  </div>
                  <div className="text-white/80 capitalize">
                    {forecast.weather[0].description}
                  </div>
                  <div className="text-white/60 text-sm">
                    {formatTime(forecast.dt)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white text-2xl font-bold">
                  {Math.round(forecast.main.temp)}°C
                </div>
                <div className="text-white/80 text-sm">
                  {Math.round(forecast.main.temp_min)}° / {Math.round(forecast.main.temp_max)}°
                </div>
                <div className="text-white/60 text-sm mt-1">
                  💧 {forecast.main.humidity}% | 💨 {forecast.wind.speed} m/s
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-white/80 text-xs uppercase tracking-wide">Pressure</div>
                <div className="text-white font-semibold">{forecast.main.pressure} hPa</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-white/80 text-xs uppercase tracking-wide">Feels Like</div>
                <div className="text-white font-semibold">{Math.round(forecast.main.feels_like)}°C</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-white/80 text-xs uppercase tracking-wide">Rain</div>
                <div className="text-white font-semibold">{Math.round(forecast.pop * 100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};