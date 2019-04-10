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
        currentCoach = null;
      }
      else {
        console.log("Rows empty, adding to coaches.");
        await mysql.connect.execute("INSERT INTO coaches(email, password, fname, lname, phone_number, bio, photo) VALUES(?, ?, ?, ?, ?, ?, ?);", [email.toLowerCase(), password, fname, lname, phone, bio, photo]);
        const [rows2, fields2] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
        const currCoach = rows2.map(x => new ExecutiveCoach.ExecutiveCoach(x));
        console.log("Current coach: " + currCoach[0]);
        currentCoach = currCoach[0];
      }
    }
    return currentCoach;
  },

  signUpExecutive: async function(fname, lname, email, phone, password, bio, photo, coach_id) {
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
    const [rowsID, fieldsID] = await mysql.connect.execute("SELECT * FROM coaches WHERE coach_id = ?", [coach_id]);
    currentExecutive = null;
    var message = "";
    if (rows != null) {
      if (rows.length != 0) {         // if email already exists
        currentExecutive = -1;
      }
      else if (rowsID.length == 0) {  // if coach ID isn't found

        currentExecutive = -2;
      }
      else {
        await mysql.connect.execute("INSERT INTO executives(email, password, fname, lname, phone_number, message, bio, photo, coach_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [email.toLowerCase(), password, fname, lname, phone, message, bio, photo, coach_id]);
        const [rows2, fields2] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
        const currExecutive = rows2.map(x => new Executive.Executive(x));
        currentExecutive = currExecutive[0];
      }
    }
    return currentExecutive;
  },


  getClients: async function(user) {
    var id = user.coach_id_val;
    var clientList = [];
    console.log(id);
    await mysql.connect.execute("SELECT * FROM executives WHERE coach_id = "+id, function(err, rows) {
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
