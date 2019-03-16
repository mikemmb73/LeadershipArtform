var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');
var currentExecutive;

// var connection = mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Chalked1512!'
// });

module.exports = {
	authenticate: function(email, password, passport) {
		var passport = require('passport');
		var LocalStrategy = require('passport-local').Strategy;

		passport.serializeUser(function(user, done) {
			console.log("inside serialize");
	    done(null, user.id);
	  });

	  passport.deserializeUser(function(id, done) {
	    connection.query("SELECT * FROM coaches, executives WHERE id = "+id, function(err, rows) {
	      done(err, rows[0]);
	    });
	  });

	  passport.use('local-login', new LocalStrategy({
	    usernameField : 'email',
	    passwordField : 'password',
	    passReqToCallback : true
	  },
	  function(req, email, passport, done) {
	    connection.query("SELECT * FROM user WHERE email = '" + email + "'", function(err, rows) {
	      if (err) {
	      	return done(err);
	      }
	      if (!rows.length) {
	        return done(null, false, req.flash('loginMessage', 'User not found.'));
	      }
	      if (!(rows[0].password == password)) {
					return done(null, false, req.flash('loginMessage', 'Wrong password.'));
				}
	   		return done(null, rows[0]);
	    });
	  }));
	},

	getExecutiveAuthent: async function(email, password) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
	    if (rows != null) {
	      if (rows.length != 0) {
	        const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives where email = ?", [email.toLowerCase()]);
	        const currExecutive = rows.map(x => new Executive.Executive(x));
	        currentExecutive = currExecutive[0];
	        return currExecutive[0];
	      }
	    }
	    return null;
	},

	getCoachAuthent: async function(email, password) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
	    if (rows != null) {
	      if (rows.length != 0) {
	        const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
	        const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
	        currentCoach = currCoach[0];
	        return currCoach[0];
	      }
	    }
	    return null;
	},

	getClients: async function(user) {
	    var id = user.coach_id_val;
	    console.log("ID HERE" + id);
	    var getStatement = "SELECT * FROM executives WHERE coach_id = IFNULL(" + id + ", coach_id)";
	    const [rows, fields] = await mysql.connect.execute(getStatement);
	    const currCoach = rows.map(x => new Executive.Executive(x));
	    return currCoach;
  	},

	getExecutiveCoach: async function(executive) {
		var getStatement = "SELECT * FROM coaches WHERE coach_id = IFNULL(" + executive.coachID + ", coach_id)";
	    const [rows, fields] = await mysql.connect.execute(getStatement);
	    const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
	    return currCoach[0];
	}
};
