var express = require('express');
var router = express.Router();
var emailServices = require('../services/emailServices');
var loginservices= require('../services/loginservices')
var signup = require('../services/signup');
const bodyParser = require("body-parser");
const pug = require('pug');
var ExecutiveCoach = require('../model/executiveCoach');
var currExecutive; 
var currCoach; 
var clientList = []; 
var clients; 

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
  res.render('coachView.pug', { title: 'Coach View',  user: currCoach, clients: clients});
});

router.post('/coachView', async function(req, res) {
  var user; 
  if (req.body.fname != null) { // signup a new user
    if (currCoach == null) {
      var user = await signup.signUpCoach(req.body.fname, req.body.lname,
        req.body.email, req.body.phone_number, req.body.password, req.body.bio, req.body.photo);
      currCoach = user; 
      clients = signup.getClients(user); 
      var i;
      for (i = 0; i < clients.length; i++) {
        console.log(clients[i]); 
      }
    }
    if (user == null) {
      res.redirect('/coachSignup');
    } else {
      res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
    }
  } else if (req.body.username != null) { //signin a user
      loginservices.authenticate(req.body.email, req.body.password);
      user = await loginservices.getCoachAuthent(req.body.username, req.body.password);
      currCoach = user; 
      clients = loginservices.getClients(user); 
      var promise = Promise.resolve(clients);
      promise.then(function(value) { 
        console.log(clients); 
      }); 
      if (user == null) {
        res.redirect('/coachSignup');
      } else {
        res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
      }
  } else {
      var name = req.body.clientName;
      var email = req.body.emailAddress;
      var message = req.body.message;
	    emailServices.sendEmail(name, email, message);
      res.render('coachView.pug', {title: 'Coach View', user: currCoach});
    }

});

router.get('/executiveView', function(req,res,next){
	res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
});

router.post('/executiveView', async function(req,res,next) {
  var user; 
  if (currExecutive == null) {
    if (req.body.fname != null) {
      user = await signup.signUpExecutive(req.body.fname, req.body.lname,
      req.body.email,req.body.phone_number, req.body.password, req.body.bio, req.body.photo, req.body.coach_id);
      currExecutive = user; 
    } else {
      loginservices.authenticate(req.body.email, req.body.password);
      user = await loginservices.getExecutiveAuthent(req.body.username2, req.body.password2);
      currExecutive = user; 
    }
  }
  if (user == null && req.body.fname != null) {
    res.redirect('/executiveSignup');
  } else if (user == null && req.body.username2 != null) {
    res.redirect('/'); 
  } else {
    res.render('executiveView.pug', {title: 'ExecutiveView', user: currExecutive});
  }
});

router.get('/executiveProfile', function(req,res,next){
	res.render('executiveProfile.pug', {title: 'Executive Profile', user: currExecutive});
});

router.post('/executiveProfile', async function(req,res,next) {
  res.render('executiveProfile.pug', {title: 'Executive Profile', user: currExecutive});
});

router.get('/coachProfile_coach', function(req,res,next){
	res.render('coachProfile_coach.pug', {title: 'Coach Profile', user: currCoach});
});

router.post('/coachProfile_coach', async function(req,res,next) {
  res.render('executiveProfile.pug', {title: 'Executive Profile', user: currCoach});
});

router.get('/coachProfile_executive', function(req,res,next){
  currCoach  = loginservices.getExecutiveCoach(currExecutive); 
  var promise = Promise.resolve(currCoach);
  promise.then(function(value) { 
    res.render('coachProfile_executive.pug', {title: 'Coach Profile', user: value});
  }); 
});

router.post('/coachProfile_coach', function(req, res) {
	var name = req.body.clientName;
	var email = req.body.emailAddress;
	var message = req.body.message;
	emailServices.sendEmail(name, email, message);
	res.render('coachProfile_coach.pug', {title: 'Coach Profile'});
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
	res.render('executiveView.pug', {title: 'Executive Profile', user: currExecutive});
});



module.exports = router;
