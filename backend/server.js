require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const workerRoutes  = require('./routes/worker');
const policyRoutes  = require('./routes/policy');
const weatherRoutes = require('./routes/weather');
const claimsRoutes  = require('./routes/claims');
const payoutRoutes  = require('./routes/payout');
const { startTriggerMonitor } = require('./cron/triggerMonitor');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/worker',  workerRoutes);
app.use('/api/policy',  policyRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/claims',  claimsRoutes);
app.use('/api/payout',  payoutRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Database + Server ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldride')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 ShieldRide backend running on http://localhost:${PORT}`);
      startTriggerMonitor();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Starting server WITHOUT database (mock mode)…');
    app.listen(PORT, () => {
      console.log(`🚀 ShieldRide backend running on http://localhost:${PORT} (no DB)`);
      startTriggerMonitor();
    });
  });
