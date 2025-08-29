import React from 'react';
import { 
  Thermometer, 
  Eye, 
  Wind, 
  Droplets, 
  Gauge, 
  Sunrise, 
  Sunset,
  Navigation
} from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{data.name}, {data.sys.country}</h2>
        <p className="text-white/80 text-lg capitalize">{data.weather[0].description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Temperature Display */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
              alt={data.weather[0].description}
              className="w-32 h-32"
            />
          </div>
          <div className="text-6xl font-bold text-white mb-2">
            {Math.round(data.main.temp)}°C
          </div>
          <div className="text-white/80 text-lg">
            Feels like {Math.round(data.main.feels_like)}°C
          </div>
          <div className="flex justify-center gap-4 mt-4 text-white/70">
            <span>H: {Math.round(data.main.temp_max)}°</span>
            <span>L: {Math.round(data.main.temp_min)}°</span>
          </div>
        </div>

        {/* Weather Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <Droplets className="h-6 w-6 text-blue-300 mx-auto mb-2" />
              <div className="text-white/80 text-sm">Humidity</div>
              <div className="text-white text-xl font-semibold">{data.main.humidity}%</div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <Wind className="h-6 w-6 text-gray-300 mx-auto mb-2" />
              <div className="text-white/80 text-sm">Wind Speed</div>
              <div className="text-white text-xl font-semibold">{data.wind.speed} m/s</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <Gauge className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
              <div className="text-white/80 text-sm">Pressure</div>
              <div className="text-white text-xl font-semibold">{data.main.pressure} hPa</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <Eye className="h-6 w-6 text-purple-300 mx-auto mb-2" />
              <div className="text-white/80 text-sm">Visibility</div>
              <div className="text-white text-xl font-semibold">{(data.visibility / 1000).toFixed(1)} km</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <Sunrise className="h-6 w-6 text-orange-300 mx-auto mb-2" />
              <div className="text-white/80 text-sm">Sunrise</div>
              <div className="text-white text-lg font-semibold">{formatTime(data.sys.sunrise)}</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <Sunset className="h-6 w-6 text-red-300 mx-auto mb-2" />
              <div className="text-white/80 text-sm">Sunset</div>
              <div className="text-white text-lg font-semibold">{formatTime(data.sys.sunset)}</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <Navigation className="h-6 w-6 text-green-300 mx-auto mb-2" />
            <div className="text-white/80 text-sm">Wind Direction</div>
            <div className="text-white text-lg font-semibold">
              {getWindDirection(data.wind.deg)} ({data.wind.deg}°)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};