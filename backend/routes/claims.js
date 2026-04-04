const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Worker = require('../models/Worker');
const { runFraudCheck } = require('../services/fraudService');

router.post('/initiate', async (req, res) => {
  try {
    const { claimId } = req.body;
    
    // Support either claimId or workerId/policyId pair
    let claim;
    
    if (claimId) {
      claim = await Claim.findById(claimId).populate('workerId');
    } else {
      const { workerId, policyId, isDemo } = req.body;
      if (!workerId || !policyId) {
        return res.status(400).json({ error: 'Missing claimId or workerId/policyId' });
      }
      claim = await Claim.findOne({ workerId, policyId, status: 'Pending' }).populate('workerId');
      
      if (!claim && isDemo) {
        // Auto-create a pending claim for demo purposes
        const newClaim = new Claim({
          workerId,
          policyId,
          city: 'Bangalore',
          weatherCondition: 'Rain',
          temperature: 25,
          triggerFired: true,
          status: 'Pending'
        });
        await newClaim.save();
        claim = await Claim.findById(newClaim._id).populate('workerId');
      }
    }

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found or not pending' });
    }

    // Run Fraud Check
    const worker = claim.workerId;
    const existingClaims = await Claim.find({ workerId: worker._id });
    const triggerType = claim.weatherCondition ? claim.weatherCondition.toLowerCase() : 'rain';

    const fraudResult = runFraudCheck({
      city: worker.city,
      workHours: worker.workHours || 8,
      claimType: triggerType,
      gpsDistance: req.body.gpsDistance || 0,
      ordersCompleted: req.body.ordersCompleted || 0,
      claimHistory: existingClaims.length || 0
    });

    claim.fraudScore = fraudResult.fraudScore;
    claim.flags = fraudResult.flags;

    if (!fraudResult.passed) {
      claim.status = 'Rejected';
    } else {
      claim.status = 'Approved';
      // Automatically determine payout amount
      // In real life, might depend on tier
      claim.payoutAmount = worker.premiumPrice === 29 ? 200 : worker.premiumPrice === 59 ? 500 : 1000;
    }

    await claim.save();

    res.status(200).json({
      message: fraudResult.message,
      claim,
      fraudResult
    });

  } catch (err) {
    console.error('Error initiating claim:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/worker/:workerId', async (req, res) => {
  try {
    const claims = await Claim.find({ workerId: req.params.workerId }).sort({ createdAt: -1 });
    res.status(200).json({ claims });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
