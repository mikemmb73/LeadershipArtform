var mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'Pickoftheweek1!',
  database : 'Leadership_Artform'
});



module.exports = {
  connect: connection
};
