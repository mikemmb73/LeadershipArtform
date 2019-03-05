var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('./sqlconnect');
// var connection = mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Chalked1512!'
// });

mysql.connect.query('USE LeaderShip_Artform');

module.exports = {
	authenticate: function(email, password, passport) {
		var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
		console.log("I'm in authenticate");
		console.log("email: " + email);
		console.log("password: " + password);
		passport.serializeUser(function(user, done) {
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
	    connection.query("INSERT INTO executives (email, password) VALUES ('emalysz@usc.edu', 'password')");
	    connection.query("SELECT * FROM user WHERE email = '" + email + "'", function(err, rows) {
	      if (err) return done(err);
	      if (!rows.length) {
	        return done(null, false, req.flash('loginMessage', 'No user found.'));
	      }
	      if (!(rows[0].password == password)) return done(null, false, req.flash('loginMessage', 'Wrong password.'));
				console.log("yo");
	      return done(null, rows[0]);
	    });
	  }));
	},

	getUser: function () {
		console.log('here'); 
		return currUser; 
	}
};
