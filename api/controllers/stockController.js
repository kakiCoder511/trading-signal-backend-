const {
  fetchStockQuote,
  fetchRSI,
  fetchStockNews,
  analyseStockFactors,
  analyseMultipleStocks,
} = require("../model/stockModel");

// ✅ price Quote
exports.getQuote = async (req, res, next) => {
  const { symbol } = req.query;
  try {
    const quote = await fetchStockQuote(symbol);
    res.status(200).send({ quote });
  } catch (err) {
    next(err);
  }
};


exports.getLatestRSI = async (req, res, next) => {
  const { symbol } = req.query;

  try {
    const rsiList = await fetchRSI(symbol);
    const latest = rsiList.at(-1);

    if (!latest) {
      return res.status(404).send({ msg: `No RSI data found for ${symbol}` });
    }

    res.status(200).send({ rsi: latest });
  } catch (err) {
    next(err);
  }
};

exports.getRSI = async (req, res, next) => {
  const { symbol } = req.query;

  try {
    const rsiList = await fetchRSI(symbol);
    res.status(200).send({  rsi: rsiList.slice(-60),  latestOnly: true
 });
  } catch (err) {
    next(err);
  }
};

// ✅ getting the news
exports.getNews = async (req, res, next) => {
  const { symbol } = req.query;
  try {
    const news = await fetchStockNews(symbol);
    res.status(200).send({ news });
  } catch (err) {
    next(err);
  }
};

// ✅ Buying factors
exports.getBuyingFactors= async (req, res, next) => {
  const { symbol } = req.query;
  try {
    const factors = await analyseStockFactors(symbol);
    res.status(200).send({ factors });
  } catch (err) {
    next(err);
  }
};


exports.getTop5Recommendations = async (req, res, next) => {
  const symbols = [
  "AAPL", "MSFT", "AMZN", "NVDA", "TSLA", "META", "GOOGL", "AMD", "NFLX", "SOFI",
  "PLTR", "F", "UAL", "SHOP", "SNOW", "COIN", "BABA", "ARKK", "HOOD", "T",
  "NIO", "DIS", "BA", "ABNB", "CRM", "PYPL", "INTC", "WMT", "CVX", "XOM",
  "GE", "UBER", "RIVN", "LCID", "PFE", "MRNA", "TSM", "LULU", "SPY", "QQQ",
  "V", "MA", "SQ", "NVAX", "BIDU", "ROKU", "ZM", "AFRM", "TQQQ", "QQQ",
  "TGT", "COST", "WBA", "CVS", "BMY", "JNJ", "MRK", "PEP", "KO", "MCD",
  "SBUX", "GM", "DELL", "HPQ", "NKE", "ADBE", "ORCL", "CRM", "GS", "MS",
  "BLK", "SCHW", "TSLA", "FUBO", "DKNG", "PANW", "ENPH", "FSLR", "RUN", "NEE", "AAL", "DAL",
  "BX", "TROW", "VTI", "VOO", "ARKW", "ARKF", "ARKQ", "QQQJ", "SPYG", "SPYD"
];

  try {
    const allResults = await analyseMultipleStocks(symbols);

    // ✅ DEBUG: log all analysis results
    console.log("All stock results:", allResults);

    const filtered = allResults
      .filter(stock => !stock.error && typeof stock.score === "number" && stock.score >= 3)
      .sort((a, b) => b.score - a.score);

    res.status(200).send({ recommendations: filtered.slice(0, 5) });
  } catch (err) {console.log(err)
    next(err);
  }
};