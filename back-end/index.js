// const mongoose = require("mongoose");
const { PORT } = require("./src/config/index.config");

const app = require("./src/app");

// mongoose.connect(DB_URL, (err) => {
//   if (err) {
//     return console.error(err);
//   }
//   console.log("Connected to MongoDB");
// });

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server is running, listening to port %d", PORT);
});
