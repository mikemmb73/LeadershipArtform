var mysql = require('mysql');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'Chalked1512!',
  database : 'Leadership_Artform'
});

migration.init(connection, __dirname + '/migrations');
