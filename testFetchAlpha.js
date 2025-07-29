require("dotenv").config();
const { fetchAlphaRSI } = require("./api/model/stockModel");

const symbol = "HOOD"; // 或 HOOD

fetchAlphaRSI(symbol)
  .then((data) => {
    console.log("🎯 RSI Data:", data);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
exports.fetchAlphaRSI = fetchAlphaRSI;
