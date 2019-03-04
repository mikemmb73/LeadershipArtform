var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');
var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
});

connection.query('USE LeaderShip_Artform');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM 'coaches', 'executives' where id = "+id, function(err, rows) {
      done(err, rows[0]);
    });
  });

  passport.use('local-login', new LocalStrategy) {
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, passport, done) {
    connection.query("select * from user where email = '" + email + "'", function(err, rows) {
      if (err) return done(err);
      if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      if (!(rows[0].password == password)) return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, rows[0]);
    });
  };

}


/* POST login page. */
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) return next(err)
//     if (!user) {
//       return res.redirect('/error')
//     }
//     req.login(user, function(err) {
//       if (err) return next(err);
//       return res.redirect('/');
//     });
//   })(req, res, next);
// });
