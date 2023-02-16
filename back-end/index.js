const { PORT } = require("./src/config/index.config");
const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");

var server = app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server is running, listening to port %d", PORT);
});

module.exports = server;
