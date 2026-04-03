const axios = require('axios');

async function getWeatherData(city) {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      console.warn('⚠️ No OpenWeather API key found. Using mock weather data.');
      return getMockWeather(city);
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const temp = response.data.main.temp;
    const condition = response.data.weather[0].main;
    const triggerFired = checkTrigger(temp, condition);

    return { temp, condition, triggerFired };
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    return getMockWeather(city); // Fallback
  }
}

function checkTrigger(temp, condition) {
  // Heatwave threshold > 42C, or extreme rain/flood condition
  if (temp > 42) return true;
  if (['Thunderstorm', 'Tornado', 'Squall'].includes(condition)) return true;
  return false;
}

function getMockWeather(city) {
  // Mock data for demo purposes if API fails or no key
  const mockTemp = Math.floor(Math.random() * (45 - 30 + 1) + 30);
  const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Haze'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temp: mockTemp,
    condition,
    triggerFired: checkTrigger(mockTemp, condition)
  };
}

module.exports = { getWeatherData };
