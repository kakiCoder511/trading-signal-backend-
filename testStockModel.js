require("dotenv").config(); 
const { fetchStockQuote } = require("./api/model/stockModel");

//stock symbol
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
