var mysql2 = require('mysql2/promise');
var Goal = require('../model/goal');

module.exports = {
  addGoal: async function(goal_id, coach_id, executive_id, title, description, progress,
  frequency, date_assigned) {

    const connection = await mysql2.createPool({
      connectionLimit : 10,
      host     : 'localhost',
      user     : 'root',
      password : 'Pickoftheweek1!',
      database : 'Leadership_Artform'
    });

    const [rows, fields] = await connection.execute("SELECT * FROM coaches WHERE email = ?",[email.toLowerCase()]);
    console.log(rows);
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
      //const currCoach = new ExecutiveCoach.ExecutiveCoach(rows[0]);
      // figure out how to do rows.map(x => new ExecutiveCoach.ExecutiveCoach(x))
      //console.log(currCoach);
      return rows[0];


    }
    }
    return null;
  }
};
