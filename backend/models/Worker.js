const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  primaryApp: { type: String, required: true },
  workHours: { type: Number, required: true },
  accountNumber: String,
  ifscCode: String,
  
  // Risk profile computed at registration
  riskScore: { type: Number, default: 0 },
  tier: { type: String, enum: ['Gold', 'Silver', 'Bronze'], default: 'Bronze' },
  premiumPrice: { type: Number, default: 29 }
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
