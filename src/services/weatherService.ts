const API_KEY = '305ce756c354e2b7a7b1573da0cfa10c'; // Demo API key - replace with your own
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Mock data for fallback when API is unavailable
const mockWeatherData = {
  coord: { lon: 77.2167, lat: 28.6667 },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d"
    }
  ],
  base: "stations",
  main: {
    temp: 25.5,
    feels_like: 27.2,
    temp_min: 23.1,
    temp_max: 28.3,
    pressure: 1013,
    humidity: 65,
    sea_level: 1013,
    grnd_level: 1009
  },
  visibility: 10000,
  wind: {
    speed: 3.2,
    deg: 180,
    gust: 4.1
  },
  clouds: {
    all: 0
  },
  dt: Date.now() / 1000,
  sys: {
    type: 2,
    id: 2019346,
    country: "IN",
    sunrise: 1640834400,
    sunset: 1640870400
  },
  timezone: 19800,
  id: 1273294,
  name: "Delhi",
  cod: 200
};

const mockForecastData = {
  cod: "200",
  message: 0,
  cnt: 40,
  list: Array.from({ length: 40 }, (_, i) => ({
    dt: Date.now() / 1000 + (i * 3 * 3600),
    main: {
      temp: 25 + Math.sin(i * 0.5) * 5,
      feels_like: 27 + Math.sin(i * 0.5) * 5,
      temp_min: 22 + Math.sin(i * 0.5) * 4,
      temp_max: 28 + Math.sin(i * 0.5) * 6,
      pressure: 1013 + Math.sin(i * 0.3) * 10,
      sea_level: 1013,
      grnd_level: 1009,
      humidity: 65 + Math.sin(i * 0.4) * 15,
      temp_kf: 0
    },
    weather: [
      {
        id: i % 3 === 0 ? 801 : 800,
        main: i % 3 === 0 ? "Clouds" : "Clear",
        description: i % 3 === 0 ? "few clouds" : "clear sky",
        icon: i % 3 === 0 ? "02d" : "01d"
      }
    ],
    clouds: {
      all: i % 3 === 0 ? 20 : 0
    },
    wind: {
      speed: 2 + Math.random() * 3,
      deg: 180 + Math.random() * 60,
      gust: 3 + Math.random() * 2
    },
    visibility: 10000,
    pop: Math.random() * 0.3,
    sys: {
      pod: i % 8 < 4 ? "d" : "n"
    },
    dt_txt: new Date(Date.now() + (i * 3 * 3600 * 1000)).toISOString().replace('T', ' ').slice(0, 19)
  })),
  city: {
    id: 1273294,
    name: "Delhi",
    coord: {
      lat: 28.6667,
      lon: 77.2167
    },
    country: "IN",
    population: 10927986,
    timezone: 19800,
    sunrise: 1640834400,
    sunset: 1640870400
  }
};

const mockAirPollutionData = {
  coord: {
    lon: 77.2167,
    lat: 28.6667
  },
  list: [
    {
      main: {
        aqi: 3
      },
      components: {
        co: 233.4,
        no: 0.01,
        no2: 13.4,
        o3: 68.66,
        so2: 0.64,
        pm2_5: 24.73,
        pm10: 32.49,
        nh3: 4.92
      },
      dt: Date.now() / 1000
    }
  ]
};

const mockCitiesData = [
  {
    name: "Delhi",
    lat: 28.6667,
    lon: 77.2167,
    country: "IN",
    state: "Delhi"
  },
  {
    name: "Mumbai",
    lat: 19.0760,
    lon: 72.8777,
    country: "IN",
    state: "Maharashtra"
  },
  {
    name: "Bangalore",
    lat: 12.9716,
    lon: 77.5946,
    country: "IN",
    state: "Karnataka"
  },
  {
    name: "Chennai",
    lat: 13.0827,
    lon: 80.2707,
    country: "IN",
    state: "Tamil Nadu"
  },
  {
    name: "Kolkata",
    lat: 22.5726,
    lon: 88.3639,
    country: "IN",
    state: "West Bengal"
  }
];

export class WeatherService {
  private static instance: WeatherService;
  
  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(lat: number, lon: number) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        console.warn('API unavailable, using mock data');
        return {
          ...mockWeatherData,
          coord: { lat, lon },
          main: {
            ...mockWeatherData.main,
            temp: 20 + Math.random() * 15,
            feels_like: 22 + Math.random() * 15,
            temp_min: 18 + Math.random() * 10,
            temp_max: 25 + Math.random() * 15,
            pressure: 1000 + Math.random() * 50,
            humidity: 40 + Math.random() * 40
          }
        };
      }
      return await response.json();
    } catch (error) {
      console.warn('Error fetching current weather, using mock data:', error);
      return {
        ...mockWeatherData,
        coord: { lat, lon },
        main: {
          ...mockWeatherData.main,
          temp: 20 + Math.random() * 15,
          feels_like: 22 + Math.random() * 15,
          temp_min: 18 + Math.random() * 10,
          temp_max: 25 + Math.random() * 15,
          pressure: 1000 + Math.random() * 50,
          humidity: 40 + Math.random() * 40
        }
      };
    }
  }

  async getForecast(lat: number, lon: number) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        console.warn('API unavailable, using mock forecast data');
        return {
          ...mockForecastData,
          city: {
            ...mockForecastData.city,
            coord: { lat, lon }
          }
        };
      }
      return await response.json();
    } catch (error) {
      console.warn('Error fetching forecast, using mock data:', error);
      return {
        ...mockForecastData,
        city: {
          ...mockForecastData.city,
          coord: { lat, lon }
        }
      };
    }
  }

  async getAirPollution(lat: number, lon: number) {
    try {
      const response = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!response.ok) {
        console.warn('API unavailable, using mock air pollution data');
        return {
          ...mockAirPollutionData,
          coord: { lat, lon }
        };
      }
      return await response.json();
    } catch (error) {
      console.warn('Error fetching air pollution, using mock data:', error);
      return {
        ...mockAirPollutionData,
        coord: { lat, lon }
      };
    }
  }

  async searchCities(query: string) {
    try {
      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      if (!response.ok) {
        console.warn('API unavailable, using mock cities data');
        return mockCitiesData.filter(city => 
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.state?.toLowerCase().includes(query.toLowerCase())
        );
      }
      return await response.json();
    } catch (error) {
      console.warn('Error searching cities, using mock data:', error);
      return mockCitiesData.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.state?.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  async getCurrentPosition(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback to Delhi coordinates if geolocation is not supported
        console.warn('Geolocation not supported, using default location');
        resolve({ lat: 28.6667, lon: 77.2167 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error, using default location:', error);
          // Fallback to Delhi coordinates if geolocation fails
          resolve({ lat: 28.6667, lon: 77.2167 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }
}