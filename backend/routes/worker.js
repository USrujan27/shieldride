const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// Risk logic constants
const CITY_BASE_RISK = {
  Bangalore: 65,
  Mumbai: 80,
  Chennai: 70,
  Hyderabad: 55,
  Delhi: 75,
  Pune: 50
};

router.post('/register', async (req, res) => {
  try {
    const { name, phone, city, primaryApp, workHours, accountNumber, ifscCode } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Risk Calculation
    const baseRisk = CITY_BASE_RISK[city] || 50;
    let score = baseRisk * (workHours / 12);
    score = Math.min(Math.round(score), 100);

    let premiumPrice = 29;
    if (score >= 40 && score <= 70) premiumPrice = 59;
    if (score > 70) premiumPrice = 99;

    let tier = 'Bronze';
    if (score > 40) tier = 'Silver';
    if (score > 70) tier = 'Gold';

    // Check if worker exists to mock 'login' via phone
    let worker = await Worker.findOne({ phone });
    
    if (worker) {
      // Update existing
      worker.name = name;
      worker.city = city;
      worker.primaryApp = primaryApp;
      worker.workHours = workHours;
      worker.accountNumber = accountNumber;
      worker.ifscCode = ifscCode;
      worker.riskScore = score;
      worker.tier = tier;
      worker.premiumPrice = premiumPrice;
      await worker.save();
    } else {
      // Create new
      worker = new Worker({
        name, phone, city, primaryApp, workHours, 
        accountNumber, ifscCode, riskScore: score, tier, premiumPrice
      });
      await worker.save();
    }

    res.status(200).json({
      message: 'Worker registered successfully',
      worker,
      riskScore: score,
      tier,
      premiumPrice
    });
  } catch (err) {
    console.error('Error registering worker:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
