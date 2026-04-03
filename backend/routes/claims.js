const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Worker = require('../models/Worker');
const { analyzeFraudRisk } = require('../services/fraudService');

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
    const fraudResult = analyzeFraudRisk(claim.workerId._id, claim);
    
    claim.fraudScore = fraudResult.score;
    
    if (fraudResult.isFlagged) {
      claim.status = 'Rejected';
    } else {
      claim.status = 'Approved';
      // Automatically determine payout amount
      // In real life, might depend on tier
      claim.payoutAmount = claim.workerId.premiumPrice === 29 ? 200 : claim.workerId.premiumPrice === 59 ? 500 : 1000;
    }

    await claim.save();

    res.status(200).json({
      message: claim.status === 'Approved' ? 'Claim Approved!' : 'Claim Rejected due to unusual activity.',
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
