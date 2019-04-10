var mysql = require('mysql2');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
  connectionLimit : 10,
  host     : "leadershipartform.cc8lws3esn4q.us-west-2.rds.amazonaws.com",
  user     : "artOfLeadership",
  password : "capstone455",
  port     : "3306",
  database : "leader_artform_db"
});



migration.init(connection, __dirname + '/migrations');
