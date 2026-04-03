const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  city: { type: String, required: true },
  weatherCondition: { type: String, required: true }, 
  temperature: Number,
  triggerFired: { type: Boolean, default: true },
  
  fraudScore: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Paid'], default: 'Pending' },
  
  payoutStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  payoutId: String,
  payoutAmount: Number
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);
