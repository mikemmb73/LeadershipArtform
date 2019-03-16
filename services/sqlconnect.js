var mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
<<<<<<< HEAD
  password : 'root',

=======
  password : 'Chalked1512!',
>>>>>>> 4d5b0880658eb6740e84043a32d3aa22a311cd2f
  database : 'Leadership_Artform'
});



module.exports = {
  connect: connection
};
