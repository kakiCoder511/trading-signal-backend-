// index.js
const express = require("express");
const StockController = require("./stockController");

const app = express();
app.use(express.json());

app.get("/api/recommendations", StockController.getRecommendations);
app.get("/api/stock/:ticker", StockController.searchStock);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));