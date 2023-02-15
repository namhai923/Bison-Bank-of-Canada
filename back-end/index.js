import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();
let { PORT, DB_URL } = process.env;

mongoose.connect(DB_URL, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Connected to MongoDB");
});

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Server is running, listening to port %d", PORT);
});
