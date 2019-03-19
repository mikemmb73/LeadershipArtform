// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// var LocalStrategy   = require('passport-local').Strategy;
//
// var mysql = require('../services/sqlconnect');
// // var connection = mysql.createConnection({
// //       host: 'localhost',
// //       user: 'root',
// //       password: 'Chalked1512!'
// // });
//
// mysql.connect.query('USE LeaderShip_Artform');
//
// module.exports = function(passport) {
//
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
//
//   passport.deserializeUser(function(id, done) {
//     mysql.connect.query("SELECT * FROM coaches, executives WHERE id = "+id, function(err, rows) {
//       done(err, rows[0]);
//     });
//   });
//
//   passport.use('local-login', new LocalStrategy) {
//     usernameField : 'email',
//     passwordField : 'password',
//     passReqToCallback : true
//   },
//   function(req, email, passport, done) {
//     mysql.connect.query("INSERT INTO executives (email, password) VALUES ('emalysz@usc.edu', 'password')");
//     mysql.connect.query("SELECT * FROM user WHERE email = '" + email + "'", function(err, rows) {
//       if (err) return done(err);
//       if (!rows.length) {
//         return done(null, false, req.flash('loginMessage', 'No user found.'));
//       }
//       if (!(rows[0].password == password)) return done(null, false, req.flash('loginMessage', 'Wrong password.'));
//       return done(null, rows[0]);
//     });
//   };
//
// }
//
//
// // /* POST login page. */
// // router.post('/login',
// //   passport.authenticate('local', { successRedirect: '/executiveView',
// //                                    failureRedirect: '/',
// //                                    failureFlash: true })
// // );
//
// router.post('/', function(req, res) {
// 	res.render('executiveView.pug', {title: 'Coach Profile'});
// });
//
// // router.post('/login', function(req, res, next) {
// //   passport.authenticate('local', function(err, user, info) {
// //     if (err) return next(err)
// //     if (!user) {
// //       return res.redirect('/error')
// //     }
// //     req.login(user, function(err) {
// //       if (err) return next(err);
// //       return res.redirect('/');
// //     });
// //   })(req, res, next);
// // });
