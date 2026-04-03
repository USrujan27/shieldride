function analyzeFraudRisk(workerId, claimDetails) {
  // In a real app, this would check past claims, location spoofing, etc.
  // Here we use a random score 0-100 for demonstration.
  
  const score = Math.floor(Math.random() * 100);
  const isFlagged = score > 75;
  
  return {
    score,
    isFlagged,
    reason: isFlagged ? 'Unusual claim pattern detected based on historical data' : null
  };
}

module.exports = { analyzeFraudRisk };
