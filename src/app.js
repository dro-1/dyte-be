require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const auctionController = require("./controllers/auctionController");
const dbConnector = require("./utils/db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/createAuction", auctionController.createAuction);

app.post("/addParticipant", auctionController.addParticipant);

const PORT = process.env.PORT || 8080;

dbConnector(() => {
  app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });
});
