var mysql2 = require('mysql2/promise');

/*
If choosing to host on the actual website, use these environmental variables
(specified in the .env file) to access AWS.
*/
var connection = mysql2.createPool({
  connectionLimit : 10,
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DB_NAME
});

/*
If choosing to host locally, use your mySQL credentials
*/

// var connection = mysql2.createPool({
//   connectionLimit : 10,
//   host     : 'localhost',
//   user     : 'root',
//   password : 'rootroot',
//   database : 'Leadership_Artform'
// });


module.exports = {
  connect: connection
};
