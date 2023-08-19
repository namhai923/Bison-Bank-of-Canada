const mongoose = require("mongoose");
const { exportDB } = require("./vars.config");

const connectDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(exportDB, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

module.exports = connectDB;
