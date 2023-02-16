const { PORT } = require("./src/config/index.config");

const app = require("./src/app");
console.log(PORT);
var server = app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server is running, listening to port %d", PORT);
});

module.exports = server;
