const generateHints = ({ rsi, todayVolume, maxVolume, score }) => {
  const hints = [];

  if (rsi < 30) {
    hints.push("RSI is below 30 — potential rebound opportunity");
  } else if (rsi >= 30 && rsi <= 45) {
    hints.push(
      "RSI is rising but still in weak zone — early signs of recovery"
    );
  } else if (rsi > 45 && rsi <= 55) {
    hints.push("RSI is around 50 — possible trend shift zone");
  } else if (rsi > 55 && rsi <= 70) {
    hints.push("RSI rising above 50 — trend turning bullish");
  } else if (rsi > 70) {
    hints.push("RSI is above 70 — watch out for overbought conditions");
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
