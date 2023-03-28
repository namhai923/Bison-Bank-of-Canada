const dotenv = require("dotenv");

dotenv.config();
let { PORT, DB_URL, TESTDB_URL, LOADTEST_URL } = process.env;

var exportDB = DB_URL;
if(process.env.NODE_ENV === 'test'){
  exportDB = TESTDB_URL;
}else if(process.env.NODE_ENV === 'LOADTEST'){
  exportDB = LOADTEST_URL;
}

module.exports = { PORT, exportDB };
