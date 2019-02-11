var express = require('express');
var router = express.Router();
const pug = require('pug');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('test');
});

module.exports = router;
