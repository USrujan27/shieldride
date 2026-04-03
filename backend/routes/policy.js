const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const Worker = require('../models/Worker');

router.post('/activate', async (req, res) => {
  try {
    const { workerId, premiumPaid } = req.body;

    if (!workerId || !premiumPaid) {
      return res.status(400).json({ error: 'Missing workerId or premiumPaid' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Check for existing active policy
    const existingPolicy = await Policy.findOne({ workerId, status: 'Active' });
    if (existingPolicy) {
      return res.status(400).json({ error: 'Policy already active for this worker', policy: existingPolicy });
    }

    // Create 7 day policy
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const policy = new Policy({
      workerId,
      startDate,
      endDate,
      premiumPaid,
      status: 'Active'
    });

    await policy.save();

    res.status(200).json({ message: 'Policy activated successfully', policy });
  } catch (err) {
    console.error('Error activating policy:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
