const mongoose = require("mongoose");
const { exportDB } = require("./config/index.config");

mongoose.connect(exportDB, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Connected to MongoDB");
});
