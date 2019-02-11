var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Leadership as an Artform' });
});

/* GET signup page for executive. */
router.get('/', function(req, res, next) {
  res.render('executiveSignup', { title: 'Executive Signup' });
});

module.exports = router;
