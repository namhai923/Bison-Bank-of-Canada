const mongoose = require("mongoose");

const { PORT } = require("./src/config/vars.config");
const app = require("./src/app");
const { logEvent } = require("./src/middleware/logger");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT || 3000, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Server is running, listening to port %d", PORT);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvent(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
