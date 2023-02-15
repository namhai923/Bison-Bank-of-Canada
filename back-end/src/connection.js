const mongoose = require("mongoose");
const { DB_URL } = require("./config/index.config");

mongoose.connect(DB_URL, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Connected to MongoDB");
});
