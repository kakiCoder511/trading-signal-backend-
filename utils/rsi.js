function calculateRSI(closingPrices, dates, period = 10) {
  if (closingPrices.length < period + 1 || dates.length !== closingPrices.length) {
    return [];
  }

  const rsiList = [];

  for (let i = period; i < closingPrices.length; i++) {
    const slice = closingPrices.slice(i - period, i + 1);
    let gains = 0;
    let losses = 0;

    for (let j = 1; j < slice.length; j++) {
      const change = slice[j] - slice[j - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const averageGain = gains / period;
    const averageLoss = losses / period;

    const rs = averageLoss === 0 ? 100 : averageGain / averageLoss;
    const rsi = 100 - 100 / (1 + rs);

    const rsiValue = parseFloat(rsi.toFixed(2));

    let status = "";
    if (rsiValue < 30) status = "oversold";
    else if (rsiValue > 70) status = "overbought";
    else status = "neutral";

    rsiList.push({
      time: dates[i].split("T")[0],
      value: rsiValue,
      status, 
    });
  }

  return rsiList;
}

module.exports = calculateRSI;
