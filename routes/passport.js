var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//       host: 'IP',
//       user: 'root',
//       password: 'password'
//     });

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
