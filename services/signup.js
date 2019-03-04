var mysql2 = require('mysql2/promise');
var ExecutiveCoach = require('../model/executiveCoach');



module.exports = {
  signUpCoach: async function(fname, lname, email, phone, password, bio, photo) {

    const connection = await mysql2.createPool({
      connectionLimit : 10,
      host     : 'localhost',
      user     : 'root',
      password : 'Chalked1512!',
      database : 'Leadership_Artform'
    });

    const [rows, fields] = await connection.execute("SELECT * FROM coaches WHERE email = ?",[email.toLowerCase()]);
    if (rows != null) {
      if (rows.length != 0) {
        console.log("duplicate email");
        return null;
      } else {
      console.log("adding to coaches.");
      console.log(photo);
      connection.execute("INSERT INTO coaches(email, password, fname, lname, phone_number, bio, photo) VALUES(?, ?, ?, ?, ?, ?, ?);",[email.toLowerCase(), password, fname, lname, phone, bio, photo]);
      console.log("success!");
      const [rows, fields] = await connection.execute("SELECT * FROM coaches where email = ?", [email.toLowerCase()]);
      console.log(rows);
      const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
      return currCoach[0];


    }
    }
    return null;
  }
};
