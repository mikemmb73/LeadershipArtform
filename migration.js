var mysql = require('/services/sqlconnect');
var migration = require('mysql-migrations');

// var connection = mysql.createPool({
//   connectionLimit : 10,
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Pickoftheweek1!',
//   database : 'Leadership_Artform'
// });


migration.init(mysql.connect, __dirname + '/migrations');
