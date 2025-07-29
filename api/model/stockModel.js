const yahooFinance = require("yahoo-finance2").default;
const calculateRSI = require("../../utils/rsi"); //  RSI calculation

const average = (arr) => arr.reduce((sum, n) => sum + n, 0) / arr.length;
const generateHints = require("../../utils/generateHints");

// ✅ RSI data
const fetchRSI = async (symbol) => {
  const result = await yahooFinance.historical(symbol, {
    period1: "2024-07-01",
    interval: "1d",
  });

  const closePrices = result.map((day) => day.close);
  const dates = result.map((day) => {
    console.log("🔍 day.date =", day.date);
    return day.date?.toISOString?.();
  });

  console.log("📈 closePrices.length =", closePrices.length);
  console.log("🗓️ dates.length =", dates.length);
  console.log("🗓️ dates =", dates.slice(0, 3)); // print first 3 only

  const rsiList = calculateRSI(closePrices, dates, 10);

  console.log("📊 RSI output =", rsiList.slice(0, 3)); // check what comes out

  return rsiList;
};

// ✅ stock price
const fetchStockQuote = async (symbol) => {
  const result = await yahooFinance.quote(symbol);
  return result;
};

// ✅ Yahoo Finance news（search ）
const fetchStockNews = async (symbol, limit = 5) => {
  try {
    const result = await yahooFinance.search(symbol, {
      quotesCount: 0,
      newsCount: limit,
    });

    const news = result.news || [];

    return news.map((article) => {
      const rawTime = article.providerPublishTime;
      const validTime =
        typeof rawTime === "number" &&
        rawTime > 1000000000 &&
        rawTime < 5000000000;

      return {
        title: article.title,
        publisher: article.publisher,
        link: article.link,
        providerPublishTime: validTime
          ? new Date(rawTime * 1000).toLocaleString()
          : "N/A",
      };
    });
  } catch (err) {
    throw {
      status: 500,
      msg: "Failed to fetch stock news",
      error: err,
    };
  }
};

// ✅ Score the stock
const calculateScore = ({ rsi, volumeSpike, bullishCandles, newHigh }) => {
  let score = 0;

  if (rsi < 30) score += 1;
  if (rsi > 50 && rsi < 70) score += 1;

  if (volumeSpike) score += 1;

  if (bullishCandles >= 2) score += 1;
  if (bullishCandles >= 4) score += 1;

  if (newHigh) score += 1;

  return score;
};

// ✅ Analyse Single stock
const analyseStockFactors = async (symbol) => {
  try {
    const historical = await yahooFinance.historical(symbol, {
      period1: new Date("2024-07-01"),
      interval: "1d",
    });

    if (!historical || historical.length < 20) {
      throw new Error("Insufficient historical data for analysis.");
    }

    const closePrices = historical.map((day) => day.close);
    const dates = historical.map((day) => day.date.toISOString());
    const volumeData = historical.map((day) => day.volume);

    // ✅  RSI
    const rsiData = calculateRSI(closePrices, dates, 10);

    if (!rsiData.length) {
      throw new Error("RSI calculation failed — possibly not enough data.");
    }

    const latestRSIEntry = rsiData.at(-1);
    const rsi = latestRSIEntry?.value;

    if (typeof rsi !== "number") {
      throw new Error("Invalid RSI value.");
    }

    // ✅ Volume spike
    const todayVolume = volumeData.at(-1);
    const maxVolume = Math.max(...volumeData.slice(-11, -1));
    const volumeSpike = todayVolume > maxVolume;

    // ✅ Bullish candles
    const bullishCandles = historical
      .slice(-5)
      .filter((day) => day.close > day.open).length;

    // ✅ New high
    const newHigh =
      closePrices.at(-1) > Math.max(...closePrices.slice(-10, -1));

    // ✅ Near 20-day moving average
    const ma20 = average(closePrices.slice(-20));
    const todayClose = closePrices.at(-1);
    const nearMA20 = Math.abs(todayClose - ma20) / ma20 <= 0.01;

    // ✅ Score + hints
    const score = calculateScore({
      rsi,
      volumeSpike,
      bullishCandles,
      newHigh,
    });

    const hints = generateHints({
      rsi,
      todayVolume,
      maxVolume,
      score,
    });

    return {
      symbol,
      rsi: rsi.toFixed(1),
      volumeSpike,
      bullishCandles,
      newHigh,
      nearMA20,
      score,
      hints,
    };
  } catch (err) {
    console.error(`❌ Error analysing ${symbol}:`, err.message || err);
    return Promise.reject({
      symbol,
      error: true,
      msg: err.message || "Unexpected analysis error",
    });
  }
};


// ✅ Analyse Multiple Stocks (for recommendation use ）
const analyseMultipleStocks = async (symbols) => {
  const results = [];

  for (const symbol of symbols) {
    try {
      const factors = await analyseStockFactors(symbol);
      results.push(factors);
    } catch (err) {
      results.push({ symbol, error: true, msg: err.msg });
    }
  }

  return results;
};

module.exports = {
  fetchRSI,
  fetchStockQuote,
  fetchStockNews,
  analyseStockFactors,
  analyseMultipleStocks,
};
