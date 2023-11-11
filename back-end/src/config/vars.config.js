const dotenv = require("dotenv");

dotenv.config();
let {
  PORT,
  FRONTEND_URL,
  POKEAPI_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DB_URL,
  TESTDB_URL,
  LOADTEST_URL,
} = process.env;

let CACHE_EXPIRED_IN_SECONDS = 300;
let ACCESS_TOKEN_EXPIRED = "15m";
let REFRESH_TOKEN_EXPIRED = "7d";

var exportDB = DB_URL;
if (process.env.NODE_ENV === "test") {
  exportDB = TESTDB_URL;
} else if (process.env.NODE_ENV === "LOADTEST") {
  exportDB = LOADTEST_URL;
}

module.exports = {
  PORT,
  FRONTEND_URL,
  POKEAPI_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  exportDB,
  CACHE_EXPIRED_IN_SECONDS,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_EXPIRED,
};
