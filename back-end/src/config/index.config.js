const dotenv = require("dotenv");

dotenv.config();
let { PORT, DB_URL, TESTDB_URL } = process.env;
var exportDB = DB_URL;
if(process.env.NODE_ENV === 'test'){
  exportDB = TESTDB_URL;
}
console.log(exportDB);
module.exports = { PORT, exportDB };
