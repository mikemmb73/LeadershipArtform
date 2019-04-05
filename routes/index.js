var express = require('express');
var router = express.Router();
var emailServices = require('../services/emailServices');
var loginservices= require('../services/loginservices')
var notesServices = require('../services/notesServices');
var profileServices = require('../services/profileServices');
var responseServices = require('../services/responseServices');
var signup = require('../services/signup');
var qs = require('qs');
const pug = require('pug');
var ExecutiveCoach = require('../model/executiveCoach');
var addGoalService = require('../services/addGoalServices');
var currExecutive;
var currCoach;
var clients;
var currGoal;
var user;


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
  if (req.body.remindAll != null) {
    emailServices.sendAllReminders(clients);
  }
  res.render('coachView.pug', { title: 'Coach View',  user: currCoach, clients: clients});
});

router.post('/coachView', async function(req, res) {
  if (req.body.fname != null) {
    if (currCoach == null) {
      user = await signup.signUpCoach(req.body.fname, req.body.lname,
        req.body.email, req.body.phone_number, req.body.password, req.body.bio, req.body.photo);
      if (user == null) {
        res.render('coachSignup.pug', { title: 'Coach Signup', signupMessage1: 'Duplicate email! Try again or Login.' });
      }
      else {
        var promise = Promise.resolve(user);
        promise.then(function(value) {
        });
        currCoach = user;
        var clientList = [];
        res.render('coachView.pug', {title: 'Coach View', user: currCoach, clients: clientList});
      }
    }
  } else if (req.body.username != null) { //signin a user
      user = await loginservices.getCoachAuthent(req.body.username, req.body.password);
      currCoach = user;
      if (user == null && req.body.username != null) {   // auth passes null if username doesn't match pass
        console.log("Password doesn't match (inside index.js)");
        res.render("index", { title: 'Leadership as an Artform', message: 'Incorrect email or password! Try again.' });
      }
      else {
        clients = await loginservices.getClients(user);
        res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
      }
  } else if (req.body.emailReminder != null) {
      emailServices.sendOneReminder(req.body.emailReminder);
  } else if (req.body.addCoachGoal != null) {
    var data2 = qs.parse(req.body);
    if (data2.goalTitle != "") {
      addGoalService.addGoalCoach(data2, currCoach, clients);
    } else {
      addGoalService.addPrevGoal(data2, req.body.GoalButton, currCoach, clients);
    }
    res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
  } else { //sending an email to invite a client
      var name = req.body.clientName;
      var email = req.body.emailAddress;
      var message = req.body.message;
	    emailServices.sendEmail(currCoach, name, email, message);
      res.render('coachView.pug', {title: 'Coach View', user: currCoach, clients: clients});
    }

});

router.get('/executiveView', async function(req,res,next){
  if (currExecutive == null) {
    res.redirect('/');
  } else {
    var user = await loginservices.getExecutiveAuthent(currExecutive.username, currExecutive.pass);
    currExecutive = user;
	   res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
   }
});

router.post('/executiveView', async function(req,res,next) {
  if (currExecutive == null) {
    if (req.body.fname != null) {
      user = await signup.signUpExecutive(req.body.fname, req.body.lname,
      req.body.email,req.body.phone_number, req.body.password, req.body.bio, req.body.photo, req.body.coach_id);

      if (user == null) {   // duplicate email
        console.log("is this a duplicate email?");
        res.render('executiveSignup.pug', { title: 'Executive Signup', signupMessage1: 'Duplicate email! Try again or Login.' });
      }
      currExecutive = user;
    } else {
      user = await loginservices.getExecutiveAuthent(req.body.username2, req.body.password2);
      currExecutive = user;
    }
  }
  if (user == null && req.body.fname != null) {
    res.redirect('/executiveSignup');
  } else if (user == null && req.body.username2 != null) {  // auth passes null if username doesn't match pass
      res.render("index", { title:'Leadership as an Artform', message2: 'Incorrect email or password! Try again.' });
  } else {
      res.render('executiveView.pug', {title: 'ExecutiveView', user: currExecutive});
  }
});

router.get('/executiveProfile', async function(req,res,next){
  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);
	res.render('executiveProfile.pug', {title: 'Executive Profile', user: currExecutive, pastGoals: pastGoals});
});

router.post('/executiveProfile', async function(req,res,next) {
  var newInfo = req.body;
  console.log(newInfo);
  await profileServices.editExecutiveInfo(newInfo, currExecutive);

  res.redirect('/executiveProfile');
});

router.get('/executiveProfile_coach', async function(req,res,next){
  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);
  console.log("past goals in execProfile_coach GET: " + pastGoals);
  res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: currExecutive, pastGoals: pastGoals});
});

router.post('/executiveProfile_coach', async function(req,res,next) {
  var notes;
  currExecutive = await loginservices.getExecutive(req.body.profileClick);
  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);
  console.log("currExecutive is " + currExecutive.execID);

  var execGoals = await profileServices.getExecGoals(currExecutive.execID);
  currExecutive.exec_goals = execGoals;
  console.log("exec's current goals are: " + currExecutive.exec_goals);

  if (req.body.noteContent != null){
    await notesServices.addNote(req.body.currExecID, currCoach.coach_id_val, req.body.noteContent);
    notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id_val);
  }

  notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id_val);
  var promise = Promise.resolve(currExecutive);
  promise.then(function(value) {
    res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: value, notes: notes, pastGoals:pastGoals});
  });
});

router.get('/coachProfile_coach', function(req,res,next){
	res.render('coachProfile_coach.pug', {title: 'Coach Profile', user: currCoach, clients: clients});
});

router.post('/coachProfile_coach', async function(req,res,next) {
  var newInfo = req.body;
  console.log(newInfo);
  await profileServices.editCoachInfo(newInfo, currCoach);
  console.log("after call to profileServices");
  res.redirect('/coachProfile_coach');
  // res.render('executiveProfile.pug', {title: 'Executive Profile', user: currCoach});
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
  var promise = Promise.resolve(clients2);
  promise.then(function(value) {
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
  if (req.body.isViewGoal == "yes"){ //if coming from viewGoal_executive
    console.log(req.body);
    var goal_id = req.body.goal_id;
    var goal = await responseServices.getGoalWithID(goal_id);
    var questions = await responseServices.getQuestions(goal_id);
    console.log("goal questions are: " + questions);
    goal.goal_questions = questions;
    console.log("NOW goal questions are: " + goal.goal_questions);
    res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  }
  else {      //if coming from addGoal_executive
      var data = qs.parse(req.body);
      await addGoalService.addGoalExecutive(data, currExecutive);
      var goal = await addGoalService.viewGoalExecutive(data, currExecutive);
      console.log("goal is " + goal.id + " and title is " + goal.goal_title + " and the length of questions is " + goal.goal_questions.length);
      //getClientsSelected() should grab the clients chosen in a goal form on addGoal_coach and then set clients: to that returned var
      console.log("rendering view");

      res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  }



});


router.post('/viewGoal_executive', async function(req, res) {
  if (req.body.isEditGoalExec == 'yes'){
    var goal = await responseServices.getGoalWithID(req.body.goalID);
    var mcQuestionCount = req.body.mcQuestionCount;
    var likertQuestionCount = req.body.likertQuestionCount;
    await responseServices.addResponses(goal, req.body, mcQuestionCount, likertQuestionCount);
    var user = await loginservices.getExecutiveAuthent(currExecutive.username, currExecutive.pass);
    currExecutive = user;
    res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
  }
  else if (req.body.progress != null){
    await addGoalService.updateProgress(req.body.goalID, req.body.progress);
    res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
  }
  else {
    var goal = await addGoalService.getGoalWithId(req.body.goal_id);
    var currResponse = null;
    if (goal.goal_responses.length > 0) {
      currResponse = goal.goal_responses[0]
    }
    res.render('viewGoal_executive.pug', {goal: goal, currResponse: currResponse});
  }


});

router.post('/viewGoal_coach', async function(req, res) {
    var goal = await addGoalService.getGoalWithId(req.body.goal_id);
    var currResponse = null;
    if (goal.goal_responses.length > 0) {
      currResponse = goal.goal_responses[0]
    }
    res.render('viewGoal_coach.pug', {goal: goal, currResponse: currResponse});

});




module.exports = router;
