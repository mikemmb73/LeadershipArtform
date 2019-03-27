var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');
var currentExecutive;
var currentCoach;

module.exports = {
  signUpCoach: async function(fname, lname, email, phone, password, bio, photo) {
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
    currentCoach = null;
    if (rows != null) {
      if (rows.length != 0) {
        console.log("duplicate email");
        currentCoach = null;
      }
      else {
        console.log("Rows empty, adding to coaches.");
        mysql.connect.execute("INSERT INTO coaches(email, password, fname, lname, phone_number, bio, photo) VALUES(?, ?, ?, ?, ?, ?, ?);", [email.toLowerCase(), password, fname, lname, phone, bio, photo]);
        console.log("success!");
        const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
        const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
        currentCoach = currCoach[0];
      }
    }
    return currentCoach;
  },

  signUpExecutive: async function(fname, lname, email, phone, password, bio, photo, coach_id) {
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
    currentExecutive = null;
    if (rows != null) {
      if (rows.length != 0) {
        console.log("duplicate email");
        currentExecutive = null;
      }
      else {
        mysql.connect.execute("INSERT INTO executives(email, password, fname, lname, phone_number, bio, photo, coach_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?);", [email.toLowerCase(), password, fname, lname, phone, bio, photo, coach_id]);
        console.log("success!");
        const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
        const currExecutive = rows.map(x => new Executive.Executive(x));
        currentExecutive = currExecutive[0];
      }
    }
    return currentExecutive;
  },



  getClients: function(user) {
    var id = user.coach_id_val;
    var clientList = [];
    console.log(id);
    mysql.connect.execute("SELECT * FROM executives WHERE coach_id = "+id, function(err, rows) {
      var i;
      console.log('in select statement');
      console.log(rows.length);
      for (i = 0; i < rows.length; i++) {
        clientList.push(rows[i]);
      }
    });
    console.log(clientList.length);
    return clientList;
  },

  getCurrentExecutive: function() {
    return currentExecutive;
  },

  getCurrentCoach: function() {
    return currentCoach;
  }

};
