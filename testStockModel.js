require("dotenv").config(); // 確保可以讀到 .env 入面嘅 API key
const { fetchStockQuote } = require("./api/model/stockModel");

// 測試邊隻股票
const testSymbol = "HOOD";

console.log(`🔍 Testing API for stock: ${testSymbol}\n`);

fetchStockQuote(testSymbol)
  .then((quote) => {
    console.log("💹 Quote Data:");
    console.log(quote);
    return fetchRSI(testSymbol);
  })
  .then((rsiData) => {
    console.log("\n📈 RSI Data:");
    console.log(rsiData);
  })
  .catch((err) => {
    console.error("\n❌ Error occurred:");
    console.error(err);
  });
