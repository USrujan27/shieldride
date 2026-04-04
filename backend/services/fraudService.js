function runFraudCheck(workerData = {}) {
  const {
    city = "Bangalore",
    workHours = 8,
    claimType = "rain",
    gpsDistance = 0,
    ordersCompleted = 0,
    claimHistory = 0
  } = workerData;

  let fraudScore = 0;
  const flags = [];

  // Layer 1 — GPS Validation
  // If worker moved more than 5km during disruption = suspicious
  if (gpsDistance > 5) {
    fraudScore += 40;
    flags.push("GPS movement detected during disruption window");
  }

  // Layer 2 — Platform Activity Cross-Check
  // If worker completed orders during disruption = fake claim
  if (ordersCompleted > 0) {
    fraudScore += 40;
    flags.push("Orders completed during disruption window");
  }

  // Layer 3 — Anomaly Scoring
  // Too many claims in short period = suspicious
  if (claimHistory > 3) {
    fraudScore += 10;
    flags.push("High claim frequency detected");
  }

  // Work hours check — part time worker claiming full day loss
  if (workHours < 4 && claimHistory > 2) {
    fraudScore += 10;
    flags.push("Part-time worker with high claim frequency");
  }

  const passed = fraudScore <= 50;
  const status = passed ? "approved" : "flagged";

  return {
    fraudScore,
    passed,
    status,
    flags,
    message: passed
      ? "Fraud check passed. Payout approved."
      : "Claim flagged for review. Payout held."
  };
}

module.exports = { runFraudCheck };
