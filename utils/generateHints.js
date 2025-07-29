const generateHints = ({ rsi, todayVolume, maxVolume, score }) => {
  const hints = [];

  if (rsi < 30) {
    hints.push("RSI is below 30 — potential rebound opportunity");
  } else if (rsi > 70) {
    hints.push("RSI is above 70 — watch out for overbought conditions");
  } else {
    hints.push("RSI is in neutral zone — no strong trend detected");
  }

  if (todayVolume > maxVolume) {
    hints.push("Volume spike — sudden increase in trading activity");
  }

  if (score >= 5) {
    hints.push("Strong bullish signals — watch for breakout");
  } else if (score <= 2) {
    hints.push("Weak signal — might need confirmation before entry");
  }

  return hints;
};

module.exports = generateHints;
