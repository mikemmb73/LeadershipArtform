var mysql2 = require('mysql2/promise');

var connection = mysql2.createPool({
  connectionLimit : 10,
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DB_NAME
});

// var connection = mysql2.createPool({
//   connectionLimit : 10,
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Pickoftheweek1!',
//   database : 'Leadership_Artform'
// });


module.exports = {
  connect: connection
};