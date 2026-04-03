const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../services/weatherService');

router.get('/:city', async (req, res) => {
  try {
    const city = req.params.city;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const weather = await getWeatherData(city);
    res.status(200).json(weather);
  } catch (err) {
    console.error('Error fetching weather:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
