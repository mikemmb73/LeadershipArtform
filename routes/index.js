var express = require('express');
var router = express.Router();
var emailServices = require('../services/emailServices');
var loginservices= require('../services/loginservices')
var notesServices = require('../services/notesServices');
var signup = require('../services/signup');
var qs = require('qs');
const pug = require('pug');
var ExecutiveCoach = require('../model/executiveCoach');
var addGoalService = require('../services/addGoalServices');
var currExecutive;
var currCoach;
var clients;
var currGoal;



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
  console.log("COACH VIEW");
  if (req.body.remindAll != null) {
    emailServices.sendAllReminders(clients);
  }
  res.render('coachView.pug', { title: 'Coach View',  user: currCoach, clients: clients});
});

router.post('/coachView', async function(req, res) {
  console.log("POSTING");
  var user;
  if (req.body.fname != null) { // signup a new user
    if (currCoach == null) {
      var user = await signup.signUpCoach(req.body.fname, req.body.lname,
        req.body.email, req.body.phone_number, req.body.password, req.body.bio, req.body.photo);
      var promise = Promise.resolve(user);
      promise.then(function(value) {
        console.log("PROMISE");
      });
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
      user = await loginservices.getCoachAuthent(req.body.username, req.body.password);
      currCoach = user;
      clients = await loginservices.getClients(user);
      var promise = Promise.resolve(clients);
      promise.then(function(value) {
        console.log("testing if client is empty");
        console.log(clients);
      });
      if (user == null) {
        res.redirect('/coachSignup');
      } else {
        res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
      }
  } else if (req.body.emailReminder != null) {
      emailServices.sendOneReminder(req.body.emailReminder);
  } else {
      console.log("otherwise i'm here");
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

router.get('/executiveProfile_coach', function(req,res,next){
  console.log("GET _COACH");
  res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: currExecutive});
});

router.post('/executiveProfile_coach', async function(req,res,next) {
  var notes;
  if (req.body.noteContent == null) {
    currExecutive = await loginservices.getExecutive(req.body.profileClick);
  }
  if (req.body.noteContent != null){
    notesServices.addNote(req.body.currExecID, currCoach.coach_id_val, req.body.noteContent);
    notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id_val);
  }
  notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id_val);
  var promise = Promise.resolve(currExecutive);
  promise.then(function(value) {
    res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: value, notes: notes});
  });
});

router.get('/coachProfile_coach', function(req,res,next){
	res.render('coachProfile_coach.pug', {title: 'Coach Profile', user: currCoach, clients: clients});
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
  if (req.body.remindAll != null) {
    emailServices.sendAllReminders(clients);
  } else {
    var name = req.body.clientName;
    var email = req.body.emailAddress;
    var message = req.body.message;
    emailServices.sendEmail(name, email, message);
  }
	res.render('coachProfile_coach.pug', {title: 'Coach Profile'});
});

router.get('/addGoal_coach', function(req,res,next){
  var clients2 = loginservices.getClientGoals(currCoach);

  console.log("trying to print clients2: " + clients2);
  var promise = Promise.resolve(clients2);
  promise.then(function(value) {
    console.log("printing within promise" + value);
    res.render('addGoal_coach.pug', {title: 'Add Goal', user:currCoach, clients:clients, clients2:value});
  });
});

router.get('/addGoal_executive', function(req,res,next){
	res.render('addGoal_executive.pug', {title: 'Add Goal'});
});

router.post('/', function(req, res) {
  if (req.body.signOut != null) {
    currExecutive = null;
    currCoach = null;
    clients = null;
    res.render('index', { title: 'Leadership as an Artform' });
  } else {
    var email = req.body.User;
    var password = req.body.Password;
    res.render('executiveView.pug', {title: 'Executive Profile', user: currExecutive});
  }
});

router.post('/editGoal_executive', async function(req, res) {
  //console.log(req.body);
  //console.log(req.body["mcQuestions[0]"]);
  var data = qs.parse(req.body);
  await addGoalService.addGoalExecutive(data, currExecutive);
  console.log("adding goal");
  var goal = await addGoalService.viewGoalExecutive(data, currExecutive);
  console.log("goal is " + goal.id + " and title is " + goal.goal_title + " and the length of questions is " + goal.goal_questions.length);
  //getClientsSelected() should grab the clients chosen in a goal form on addGoal_coach and then set clients: to that returned var
  console.log("rendering view");
  res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  //res.send("currExecutive's goal length " + currExecutive.goals_list.length);
});

router.post('/viewGoal_executive', function(req, res) {
  console.log(req.body);
  res.render('viewGoal_executive.pug');
});



module.exports = router;
