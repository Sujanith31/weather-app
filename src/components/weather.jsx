import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import cloudy from '../images/cloudy.png';
import fog from '../images/fog.png';
import rain from '../images/rain.png';
import sand from '../images/sand.png';
import snowflakes from '../images/snowflake.png';
import storm from '../images/storm.png';
import sun from '../images/sun.png';
import drizzle from '../images/drizzle.png'
import humidity from '../images/humidity.png'
import errorImage from '../images/weather.png'

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState({ current: null, daily: null });
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState();
  const [error, setError] = useState(null);
  const [bgColor, setBgColor] = useState('bg-blue-700');

  useEffect(() => {
    if (latitude && longitude) {
      const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
              latitude: latitude,
              longitude: longitude,
              current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
              daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weather_code',
              timezone: 'auto',
            },
          });

          if (response.status === 200) {
            const currentWeather = response.data.current;
            const dailyWeather = response.data.daily;

            console.log('Current Weather Data:', currentWeather);
            console.log('Daily Weather Data:', dailyWeather);
            console.log(currentWeather.wind_speed_10m);
            console.log('weather code', currentWeather.weather_code);
            
            const weatherCode = currentWeather.weather_code;
            setBgColor(getBackgroundColor(weatherCode));

            if (weatherCode >= 0 && weatherCode < 20) {
              setWeatherIcon(sun);
            } else if (weatherCode >= 20 && weatherCode < 30) {
              setWeatherIcon(drizzle);
            } else if (weatherCode >= 30 && weatherCode < 40) {
              setWeatherIcon(sand);
            } else if (weatherCode >= 40 && weatherCode < 50) {
              setWeatherIcon(fog);
            } else if (weatherCode >= 50 && weatherCode < 60) {
              setWeatherIcon(drizzle);
            } else if (weatherCode >= 60 && weatherCode < 70) {
              setWeatherIcon(rain);
            } else if (weatherCode >= 70 && weatherCode < 80) {
              setWeatherIcon(snowflakes);
            } else {
              setWeatherIcon(storm);
            }

            setWeatherData({
              current: currentWeather,
              daily: dailyWeather,
            });
            console.log(weatherData);
          } else {
            console.error('Error fetching weather data:', response);
            toast.error('No results found for the weather data');
            setError('error finding the weather data')
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
          toast.error('error fetching the weather data')
          setError('Error fetching data')
        } finally {
          setLoading(false);
        }
      };
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setLatitude(data.results[0].latitude);
        setLongitude(data.results[0].longitude);
        setLocation(data.results[0].name);
      } else {
        console.error('No results found for the location');
        toast.error('No results found for the location');
        setError('error finding the location')

      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      toast.error('error fetching the location')
      setError('error finding the location')
    } finally {
      setLoading(false);
    }
  };

  const getWeatherImage = (weatherCode) => {
    if (weatherCode >= 0 && weatherCode < 20) {
      return sun;
    } else if (weatherCode >= 20 && weatherCode < 30) {
      return drizzle;
    } else if (weatherCode >= 30 && weatherCode < 40) {
      return sand;
    } else if (weatherCode >= 40 && weatherCode < 50) {
      return fog;
    } else if (weatherCode >= 50 && weatherCode < 60) {
      return drizzle;
    } else if (weatherCode >= 60 && weatherCode < 70) {
      return rain;
    } else if (weatherCode >= 70 && weatherCode < 80) {
      return snowflakes;
    } else {
      return storm;
    }
  };

  const getBackgroundColor = (weatherCode) =>{
    if (weatherCode >= 0 && weatherCode < 20) {
      return 'bg-gradient-to-br from-blue-200 to-blue-500'
    } else if (weatherCode >= 20 && weatherCode < 30) {
      return 'bg-gradient-to-br from-gray-200 to-blue-200';
    } else if (weatherCode >= 30 && weatherCode < 40) {
      return 'bg-gradient-to-br from-orange-200 to-orange-400'
    } else if (weatherCode >= 40 && weatherCode < 50) {
      return 'bg-gradient-to-br from-gray-300 to-teal-300';
    } else if (weatherCode >= 50 && weatherCode < 60) {
      return 'bg-gradient-to-br from-gray-300 to-teal-300';
    } else if (weatherCode >= 60 && weatherCode < 70) {
      return 'bg-gradient-to-br from-blue-200 to-blue-500';
    } else if (weatherCode >= 70 && weatherCode < 80) {
      return 'bg-gradient-to-br from-white to-gray-300';
    } else {
      return 'bg-gradient-to-br from-gray-500 to-indigo-900';
    }
  }

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${bgColor} h-fit shadow-xl shadow-gray-400`}>
      <h1 className="text-2xl xs:text-3xl font-normal mb-4 text-center text-white font-sans text-shadow">Weather Data</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="border-none focus:outline-none focus:scale-105 font-semibold text-gray-600 transition ease-out hover:scale-105 shadow-xl rounded py-2 px-4 mr-2"
          placeholder="Enter location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded shadow-xl transition ease-out hover:scale-105 hover:bg-white hover:text-blue-500 hover:font-bold py-2 px-4"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {loading ? (
        <div className="text-center text-white mt-10">Loading...</div>
      ) : error ? (
        <div className='text-center text-white mt-10'>
          <p className='text-white font-mono font-extralight text-2xl'>{error}</p>
          <img src={errorImage} className='mx-auto w-fit max-h-fit mt-4' alt="Error" />
        </div>
      ) : (
        weatherData.current && weatherData.daily && (
          <div>
            <div className="w-full flex justify-center items-center my-4">
              <p className="text-white text-lg xs:text-xl font-extralight text-shadow">
                High: {weatherData.daily.temperature_2m_max.slice(0, 1)}°c &nbsp;&nbsp;|&nbsp;&nbsp; Low: {weatherData.daily.temperature_2m_min.slice(0, 1)}°c
              </p>
            </div>
            <h2 className="text-3xl xs:text-4xl font-serif mb-4 text-center text-shadow text-white">{location}</h2>
            <div className="mb-4 flex flex-col justify-center items-center">
              <img src={weatherIcon} alt="Weather Icon" className="mx-auto w-16 h-16" />
              <div className="flex flex-row my-7 justify-around items-baseline w-3/4">
                <p className="text-2xl xs:text-4xl font-sans text-white font-semibold">{weatherData.current.temperature_2m.toFixed()}°c</p>
                <p className="flex flex-row items-baseline justify-between text-2xl xs:text-4xl font-sans text-white font-semibold">
                  <img src={humidity} className="w-6 xs:w-10 xs:h-10 h-6" alt="" /> {weatherData.current.relative_humidity_2m}%
                </p>
                <p className="text-2xl xs:text-4xl text-white font-sans font-semibold">
                  {weatherData.current.wind_speed_10m}
                  <span className="text-lg xs:text-2xl">km/h</span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-white font-sans text-shadow font-semibold mb-4">Daily Forecast</h2>
              <div className="overflow-x-auto">
                <table className={`min-w-full bg-white bg-opacity-30 rounded`}>
                  <thead>
                    <tr className="text-white font-serif font-thin">
                      <th className="py-4 w-1/6 px-2 border-b">Date</th>
                      <th className="py-4 px-2 w-1/5 border-b">High (°C)</th>
                      <th className="py-4 px-2 w-1/5 border-b">Low (°C)</th>
                      {/* <th className="py-4 px-2 border-b">Precipitation (mm)</th> */}
                      <th className="py-4 px-2 w-1/5 border-b">Max Wind(km/h)</th>
                      <th className="py-4 px-2 w-2/6 border-b"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.daily.time.slice(1, 6).map((date, index) => (
                      <tr className="text-white font-mono font-extralight" key={date}>
                        <td className="py-4 w-1/5 px-2 border-b">{date}</td>
                        <td className="py-4 px-2 w-1/5 border-b">{weatherData.daily.temperature_2m_max[index]}</td>
                        <td className="py-4 px-2 w-1/5 border-b">{weatherData.daily.temperature_2m_min[index]}</td>
                        {/* <td className="py-4 px-2 border-b">{weatherData.daily.precipitation_sum[index]}</td> */}
                        <td className="py-4 px-2 w-1/5 border-b">{weatherData.daily.windspeed_10m_max[index]}</td>
                        <td className="py-4 px-2 w-2/5 border-b">
                          <img src={getWeatherImage(weatherData.daily.weather_code[index])} alt="Weather Icon" className="mx-auto w-14 h-14" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
      <ToastContainer />
    </div>
  );

};

export default WeatherApp;