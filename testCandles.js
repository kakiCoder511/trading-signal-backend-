const { fetchCandles } = require("./api/model/stockModel");

fetchCandles("HOOD")
  .then((data) => {
    console.log("📊 Candle Data:", data);
  })
  .catch((err) => {
    console.error("❌ Error fetching candle:", err);
  });
