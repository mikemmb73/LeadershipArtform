/*****

notesServices.js allows express and node.js to interact with the database when the
user wishes to sign up

****/

var mysql = require("./sqlconnect.js");
var bcrypt = require('bcrypt-nodejs');
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');
var currentExecutive;
var currentCoach;

module.exports = {
  /**
  signUpCoach
  paramters- fname, lname, email, phone, password, confirmPassword, bio, photo
  purpose- Adds to the coach database if all aspects of the form are complted. Returns the
  currentCoach that was created, otherwise null if unsuccessful
  notes- Does not add to the database if the email is already in use or if the
  passwords provided do not match.
  **/
  signUpCoach: async function(fname, lname, email, phone, password, confirmPassword, bio, photo) {
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
    currentCoach = null;
    if (rows != null) {
      if (rows.length != 0) {                          // duplicate email
          currentCoach = -2;
      }
      else if (password != confirmPassword) {  // passwords provided don't match
        currentCoach = -1;
      }
      else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        await mysql.connect.execute("INSERT INTO coaches(email, password, fname, lname, phone_number, bio, photo) VALUES(?, ?, ?, ?, ?, ?, ?);", [email.toLowerCase().trim(), hash, fname.trim(), lname.trim(), phone, bio, photo]);
        const [rows2, fields2] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase().trim()]);
        const currCoach = rows2.map(x => new ExecutiveCoach.ExecutiveCoach(x));
        console.log("Current coach: " + currCoach[0]);
        currentCoach = currCoach[0];
      }
    }
    return currentCoach;
  },

  /**
  signUpExecutive
  paramters- fname, lname, email, phone, password, confirmPassword, bio, photo, coach_id
  purpose- Adds to the executive database if all aspects of the form are complted. Returns the
  currentExecutive that was created, otherwise null if unsuccessful
  notes- Does not add to the database if the email is already in use or if the
  passwords provided do not match or if the coach id does not exist.
  **/
  signUpExecutive: async function(fname, lname, email, phone, password, confirmPassword, bio, photo, coach_id) {
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase().trim()]);
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
      else if (password != confirmPassword) {  // passwords provided don't match
        currentExecutive = -3;
      }
      else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        await mysql.connect.execute("INSERT INTO executives(email, password, fname, lname, phone_number, message, bio, photo, coach_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [email.toLowerCase().trim(), hash, fname.trim(), lname.trim(), phone, message, bio, photo, coach_id]);
        const [rows2, fields2] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase().trim()]);
        const currExecutive = rows2.map(x => new Executive.Executive(x));
        currentExecutive = currExecutive[0];
      }
    }
    return currentExecutive;
  },

  /**
  getClients
  paramters- user
  purpose- Returns the clients (executives) associated with the coach.
  **/
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

  /**
  getCurrentExecutive
  purpose- Returns logged in executive.
  **/
  getCurrentExecutive: function() {
    return currentExecutive;
  },


  /**
  getCurrentCoach
  purpose- Returns logged in coach.
  **/
  getCurrentCoach: function() {
    return currentCoach;
  }

};
