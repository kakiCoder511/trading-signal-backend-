const express = require("express");
const {
  getRSI,
  getLatestRSI,
  getQuote,
  getNews,
  getBuyingFactors,
  getTop5Recommendations
} = require("../controllers/stockController");

const router = express.Router();

router.get("/rsi", getRSI);
router.get("/rsi/latest", getLatestRSI); 
router.get("/quote", getQuote);
router.get("/news", getNews);
router.get("/factors", getBuyingFactors);
router.get("/recommend", getTop5Recommendations);

module.exports = router;
