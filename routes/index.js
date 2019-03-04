var express = require('express');
var router = express.Router();
var emailServices = require('../services/emailServices');
var loginservices= require('../services/loginservices')
var signup = require('../services/signup');
const bodyParser = require("body-parser");
const pug = require('pug');
var ExecutiveCoach = require('../model/executiveCoach');

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
  console.log(req.body);
  res.render('coachSignup.pug', { title: 'Coach Signup' });
});

router.get('../model/executiveCoach.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/client.js'));
});

/* GET homepage for coach. */
router.get('/coachView', function(req, res, next) {
  res.render('coachView.pug', { title: 'Coach View',  });
});

router.post('/coachView', async function(req, res) {
  if (req.body.fname != null) { // signup a new user
    var user = await signup.signUpCoach(req.body.fname, req.body.lname,
      req.body.email, req.body.phone_number, req.body.password, req.body.bio, req.body.photo);
    if (user == null) {
      res.redirect('/coachSignup');
    } else {
      console.log(user);
      res.render('coachView.pug', {title: 'CoachView', user: user});
    }
  } else {
    console.log("its null");
    var name = req.body.clientName;
	   var email = req.body.emailAddress;
	   var message = req.body.message;
	    emailServices.sendEmail(name, email, message);
      res.render('coachView.pug', {title: 'Coach View'});
    }

});

router.get('/executiveView', function(req,res,next){
	res.render('executiveView.pug', {title: 'Executive View'});
});

router.post('/executiveView', async function(req,res,next) {
  var user = await signup.signUpExecutive(req.body.fname, req.body.lname,
  req.body.email,req.body.phone_number, req.body.password, req.body.bio, req.body.photo, req.body.coach_id);
  if (user == null) {
    res.redirect('/executiveSignup');
  } else {
    res.render('executiveView.pug', {title: 'ExecutiveView', user: user});
  }
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

router.get('/addGoal_coach', function(req,res,next){
	res.render('addGoal_coach.pug', {title: 'Add Goal'});
});

router.get('/addGoal_executive', function(req,res,next){
	res.render('addGoal_executive.pug', {title: 'Add Goal'});
});

router.post('/', function(req, res) {
  var email = req.body.User;
  var password = req.body.Password;
  loginservices.authenticate(email, password);
	res.render('executiveView.pug', {title: 'Coach Profile'});
});



module.exports = router;
