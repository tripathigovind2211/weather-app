import React from 'react';
import { useEffect } from 'react';
import { Cloud, MapPin, Thermometer } from 'lucide-react';
import { SearchBar } from './Components/SearchBar';
import { CurrentWeather } from './Components/CurrentWeather';
import { Forecast } from './Components/Forecast';
import { AirQuality } from './Components/AirQuality';
import { LoadingSpinner } from './Components/LoadingSpinner';
import { ErrorDisplay } from './Components/ErrorDisplay';
import { useWeatherData } from './hooks/useWeatherData';

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      const boltBadge = document.querySelector('a[href*="bolt.new"]');
      if (boltBadge) {
        boltBadge.remove();
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const {
    current,
    forecast,
    airQuality,
    loading,
    error,
    locationName,
    fetchWeatherData,
    getCurrentLocation,
    retry
  } = useWeatherData();

  const getBackgroundGradient = () => {
    if (!current) return 'from-blue-600 to-purple-700';
    
    const hour = new Date().getHours();
    const weather = current.weather[0].main.toLowerCase();
    
    if (hour >= 6 && hour < 12) {
      // Morning
      if (weather.includes('rain')) return 'from-gray-600 to-blue-800';
      if (weather.includes('cloud')) return 'from-blue-400 to-blue-600';
      return 'from-orange-400 to-pink-500';
    } else if (hour >= 12 && hour < 18) {
      // Afternoon
      if (weather.includes('rain')) return 'from-gray-700 to-blue-900';
      if (weather.includes('cloud')) return 'from-blue-500 to-indigo-600';
      return 'from-blue-500 to-cyan-500';
    } else if (hour >= 18 && hour < 21) {
      // Evening
      if (weather.includes('rain')) return 'from-gray-800 to-purple-900';
      return 'from-orange-600 to-purple-700';
    } else {
      // Night
      if (weather.includes('rain')) return 'from-gray-900 to-black';
      return 'from-indigo-800 to-purple-900';
    }
  };

  if (loading && !current) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !current) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()}`}>
        <ErrorDisplay message={error} onRetry={retry} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <Cloud className="h-10 w-10 text-white animate-bounce" />
                <Thermometer className="h-5 w-5 text-yellow-300 absolute -bottom-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">WeatherScope</h1>
                <p className="text-white/80 text-lg">Global Weather & Air Quality Monitor</p>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar
              onLocationSelect={fetchWeatherData}
              onCurrentLocation={getCurrentLocation}
              isLoading={loading}
            />
            
            {/* Location Display */}
            {current && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <MapPin className="h-4 w-4 text-white/70" />
                <span className="text-white/90 font-medium">{locationName}</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {current && (
              <div className="animate-fadeIn">
                <CurrentWeather data={current} />
              </div>
            )}

            {forecast && airQuality && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="animate-fadeIn delay-200">
                  <Forecast data={forecast} />
                </div>
                <div className="animate-fadeIn delay-400">
                  <AirQuality data={airQuality} />
                </div>
              </div>
            )}

            {/* Weather Tips */}
            {current && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl animate-fadeIn delay-600">
                <h3 className="text-2xl font-bold text-white mb-4">Today's Weather Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <h4 className="text-white font-semibold mb-2">Clothing Advice</h4>
                    <p className="text-white/80 text-sm">
                      {current.main.temp > 25 
                        ? "Light, breathable clothing recommended. Don't forget sunscreen!" 
                        : current.main.temp > 15 
                        ? "Comfortable layers work best for today's temperature." 
                        : "Warm clothing recommended. Consider wearing a jacket."}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <h4 className="text-white font-semibold mb-2">Activity Suggestion</h4>
                    <p className="text-white/80 text-sm">
                      {current.weather[0].main.includes('Rain') 
                        ? "Perfect day for indoor activities or cozy reading time." 
                        : current.main.temp > 20 && current.main.temp < 30 
                        ? "Great weather for outdoor activities and sports!" 
                        : "Consider indoor activities or dress appropriately for outdoor plans."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-white/20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/60 text-sm">
              Weather data provided by OpenWeatherMap • Updated in real-time
            </p>
            <p className="text-white/60 text-sm mt-2">
              Covering all countries worldwide including every city and town in India 🇮🇳
            </p>
          </div>
        </footer>
      </div>

      {loading && current && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white text-sm">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
