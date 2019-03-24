var mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
<<<<<<< HEAD
  password : 'Pickoftheweek1!',
=======
  password : 'rootroot',
>>>>>>> 56b630b6bb169fc133c1e08d5ad0d1bf3a6614f8
  database : 'Leadership_Artform'
});



module.exports = {
  connect: connection
};
