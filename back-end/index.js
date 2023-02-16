const { PORT } = require("./src/config/index.config");

const app = require("./src/app");

var server = app.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server is running, listening to port %d", 3000);
});

module.exports = server;
