const dotenv = require("dotenv");

dotenv.config();
let { PORT, DB_URL } = process.env;

module.exports = { PORT, DB_URL };
