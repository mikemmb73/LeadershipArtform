var mysql = require('mysql2');
var migration = require('mysql-migrations');

const connection = mysql2.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Leadership_Artform'
});


migration.init(connection, __dirname + '/migrations');
