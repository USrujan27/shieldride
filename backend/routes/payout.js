const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Worker = require('../models/Worker');
const { sendPayout } = require('../services/payoutService');

router.post('/send', async (req, res) => {
  try {
    const { claimId } = req.body;
    
    if (!claimId) {
      return res.status(400).json({ error: 'Missing claimId' });
    }

    const claim = await Claim.findById(claimId).populate('workerId');
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.status !== 'Approved') {
      return res.status(400).json({ error: 'Claim is not approved' });
    }

    if (claim.payoutStatus !== 'Pending') {
      return res.status(400).json({ error: 'Payout already processed or failed' });
    }

    // Call external service
    const payoutResult = await sendPayout(claim.workerId, claim.payoutAmount || 500);

    if (payoutResult.success) {
      claim.payoutStatus = 'Completed';
      claim.status = 'Paid';
      claim.payoutId = payoutResult.payoutId;
      await claim.save();
      
      res.status(200).json({ 
        message: 'Payout sent successfully via Razorpay',
        claim
      });
    } else {
      claim.payoutStatus = 'Failed';
      await claim.save();
      
      res.status(500).json({ 
        error: 'Payout failed at gateway',
        details: payoutResult.error
      });
    }

  } catch (err) {
    console.error('Error sending payout:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
