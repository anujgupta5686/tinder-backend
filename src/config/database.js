const mongoose = require("mongoose");
require("dotenv").config();
const connection = async () => {
  await mongoose.connect(
    "mongodb+srv://kodeklan:kodeklan@kodeklan.spxpnsr.mongodb.net/devTinder"
  );
};
module.exports = connection;
