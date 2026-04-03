const cron = require('node-cron');
const Worker = require('../models/Worker');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const { getWeatherData } = require('../services/weatherService');

function startTriggerMonitor() {
  console.log('⏱️  Starting weather trigger monitor (Runs every 30 mins)');
  
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('🔄 Running scheduled trigger check...', new Date().toISOString());
      
      // Get all unique cities with active policies
      const activePolicies = await Policy.find({ status: 'Active' }).populate('workerId');
      const cities = [...new Set(activePolicies.map(p => p.workerId.city))];
      
      for (const city of cities) {
        const weather = await getWeatherData(city);
        if (weather.triggerFired) {
          // Find workers in this city with active policies
          const affectedPolicies = activePolicies.filter(p => p.workerId.city === city);
          
          for (const policy of affectedPolicies) {
            // Check if claim already initiated today
            const startOfDay = new Date();
            startOfDay.setHours(0,0,0,0);
            
            const existingClaim = await Claim.findOne({
              policyId: policy._id,
              createdAt: { $gte: startOfDay }
            });

            if (!existingClaim) {
              const newClaim = new Claim({
                workerId: policy.workerId._id,
                policyId: policy._id,
                city,
                weatherCondition: weather.condition,
                temperature: weather.temp,
                triggerFired: true,
                status: 'Pending'
              });
              await newClaim.save();
              console.log(`🚨 Auto-initiated claim for policy ${policy._id} in ${city} due to weather trigger!`);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in trigger monitor:', error);
    }
  });
}

module.exports = { startTriggerMonitor };
