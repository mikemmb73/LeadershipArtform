var express = require('express');
var router = express.Router();
const pug = require('pug');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Leadership as an Artform' });
});

/* GET signup page for executive. */
router.get('/executiveSignup', function(req, res, next) {
  res.render('executiveSignup.pug', { title: 'Executive Signup' });
});

/* GET signup page for coach. */
router.get('/coachSignup', function(req, res, next) {
  res.render('coachSignup.pug', { title: 'Coach Signup' });
});

/* GET homepage for coach. */
router.get('/coachView', function(req, res, next) {
  res.render('coachView.pug', { title: 'Coach View' });
});

router.get('/executiveView', function(req,res,next){
	res.render('executiveView.pug', {title: 'Executive View'});
});

router.get('/executiveProfile', function(req,res,next){
	res.render('executiveProfile.pug', {title: 'Executive Profile'});
});

router.get('/coachProfile', function(req,res,next){
	res.render('coachProfile.pug', {title: 'Coach Profile'});
});

router.get('/addGoal', function(req,res,next){
	res.render('addGoal.pug', {title: 'Add Goal'});
});

module.exports = router;
