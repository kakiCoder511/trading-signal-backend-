const axios = require("axios");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

const getQuote = (symbol) => {
  return axios
    .get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY,
      },
    })
    .then((res) => res.data);
};

module.exports = { getQuote };
