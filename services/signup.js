var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');



module.exports = {
  signUpCoach: async function(fname, lname, email, phone, password, bio, photo) {



    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?",[email.toLowerCase()]);
    if (rows != null) {
      if (rows.length != 0) {
        console.log("duplicate email");
        return null;
      } else {
      console.log("adding to coaches.");
      console.log(photo);
      mysql.connect.execute("INSERT INTO coaches(email, password, fname, lname, phone_number, bio, photo) VALUES(?, ?, ?, ?, ?, ?, ?);",[email.toLowerCase(), password, fname, lname, phone, bio, photo]);
      console.log("success!");
      const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches where email = ?", [email.toLowerCase()]);
      console.log(rows[0].coach_id);
      const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
      console.log("!!!!!!");
      console.log(currCoach[0]);
      return currCoach[0];



    }
    }
    return null;
  }
};
