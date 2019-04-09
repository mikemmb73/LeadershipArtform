var mysql2 = require('mysql2/promise');

var connection = mysql.createPool({
  connectionLimit : 10,
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DB_NAME
});



module.exports = {
  connect: connection
};
