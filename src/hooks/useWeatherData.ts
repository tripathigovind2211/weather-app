import { useState, useEffect, useCallback } from 'react';
import { WeatherService } from '../services/weatherService';
import type { WeatherData, ForecastData, AirPollutionData } from '../types/weather';

interface WeatherDataState {
  current: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirPollutionData | null;
  loading: boolean;
  error: string | null;
  locationName: string;
}

export const useWeatherData = () => {
  const [state, setState] = useState<WeatherDataState>({
    current: null,
    forecast: null,
    airQuality: null,
    loading: false,
    error: null,
    locationName: ''
  });

  const weatherService = WeatherService.getInstance();

  const fetchWeatherData = useCallback(async (lat: number, lon: number, name: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [currentWeather, forecastData, airQualityData] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getForecast(lat, lon),
        weatherService.getAirPollution(lat, lon)
      ]);

      setState({
        current: currentWeather,
        forecast: forecastData,
        airQuality: airQualityData,
        loading: false,
        error: null,
        locationName: name
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data'
      }));
    }
  }, [weatherService]);

  const getCurrentLocation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await weatherService.getCurrentPosition();
      await fetchWeatherData(position.lat, position.lon, 'Current Location');
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to get current location. Please allow location access or search manually.'
      }));
    }
  }, [fetchWeatherData]);

  const retry = useCallback(() => {
    if (state.current) {
      fetchWeatherData(state.current.coord.lat, state.current.coord.lon, state.locationName);
    } else {
      getCurrentLocation();
    }
  }, [state.current, state.locationName, fetchWeatherData, getCurrentLocation]);

  // Load default location (New Delhi, India) on initial load
  useEffect(() => {
    fetchWeatherData(28.6139, 77.2090, 'New Delhi, India');
  }, [fetchWeatherData]);

  return {
    ...state,
    fetchWeatherData,
    getCurrentLocation,
    retry
  };
};