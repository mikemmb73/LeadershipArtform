var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Leadership as an Artform' });
});

/* GET signup page for executive. */
router.get('/executiveSignup', function(req, res, next) {
  res.render('executiveSignup.jade', { title: 'Executive Signup' });
});

/* GET signup page for coach. */
router.get('/coachSignup', function(req, res, next) {
  res.render('coachSignup.jade', { title: 'Coach Signup' });
});

module.exports = router;
