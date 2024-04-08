const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const teafilejs = require("teafilejs");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options("*", cors());

const server = require("http").Server(app);

app.get("/api/v1/chart/history", cors(), (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  const data = teafilejs.get({
    symbol: "BTCVNDC",
    broker: "NAMI_FUTURES",
    interval: "1d",
    from: 0,
    to: 1694461860,
  });

  console.log("Result", data.length, data[data.length - 1]);
  return res.status(200).json(data);
});

server.listen(process.env.PORT, () => {
  console.log(
    `Server running on http://localhost:${process.env.PORT}/api/v1/chart/history`
  );
});
