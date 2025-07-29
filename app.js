const express = require("express");
const app = express();
require("dotenv").config(); 

const stockRoutes = require("./api/routes/stockRoutes"); 

app.use(express.json()); // parse JSON body

// Routes - mounted at /api
app.use("/api", stockRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).send({ msg: err.msg || "Internal Server Error" });
});

module.exports = app;
