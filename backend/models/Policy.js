const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Claimed'], default: 'Active' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  premiumPaid: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);
