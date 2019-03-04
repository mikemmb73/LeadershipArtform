var express = require('express');
var router = express.Router();
var emailServices = require('../services/emailServices');
const bodyParser = require("body-parser");
const pug = require('pug');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

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

router.get('../model/executiveCoach.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/client.js'));
});

/* GET homepage for coach. */
router.get('/coachView', function(req, res, next) {
  res.render('coachView.pug', { title: 'Coach View',  });
});

router.post('/coachView', function(req, res) {
	var name = req.body.clientName;
	var email = req.body.emailAddress;
	var message = req.body.message;
	emailServices.sendEmail(name, email, message);
	res.render('coachView.pug', {title: 'Coach View'});
});

router.get('/executiveView', function(req,res,next){
	res.render('executiveView.pug', {title: 'Executive View'});
});

router.get('/executiveProfile', function(req,res,next){
	res.render('executiveProfile.pug', {title: 'Executive Profile'});
});

router.get('/coachProfile_coach', function(req,res,next){
	res.render('coachProfile_coach.pug', {title: 'Coach Profile'});
});

router.get('/coachProfile_executive', function(req,res,next){
	res.render('coachProfile_executive.pug', {title: 'Coach Profile'});
});


router.post('/coachProfile', function(req, res) {
	var name = req.body.clientName;
	var email = req.body.emailAddress;
	var message = req.body.message;
	emailServices.sendEmail(name, email, message);
	res.render('coachProfile.pug', {title: 'Coach Profile'});
});

router.get('/addGoal', function(req,res,next){
	res.render('addGoal.pug', {title: 'Add Goal'});
});



module.exports = router;
