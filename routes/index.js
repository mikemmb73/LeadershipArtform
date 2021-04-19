/*

index.js uses express to create routes and redirects in between the pages for
this web application. It includes all service files that are used in the
application

*/

var express = require('express');
var router = express.Router();
var emailservices = require('../services/emailservices.js');
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
const util = require('util');
const upload = require('../services/image-upload');
//const singleUpload = upload.single('image');

//ensure auth
function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Art of Leadership' });
});

router.get('/coachSignInSignUp', function(req, res, next){
  // if(req.session.user.coach_id != undefined){
  //   console.log("user already signed in")
  //   res.redirect("/coachView");
  // }else{
    res.render('coachSignInSignUp.pug', {title: 'coach'});
  // }
});

router.get('/executiveSignInSignUp', function(req, res, next){
  // if(req.session.user.executive_id != undefined){
  //   console.log("user already signed in")
  //   res.redirect("/executiveView");
  // }else{
    res.render('executiveSignInSignUp.pug', {title: 'executive'});
  //}
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
    emailservices.sendAllReminders(clients);
  }
  if (req.session && req.session.user) {
    console.log(req.session.user)
  }
  res.render('coachView.pug', { title: 'Coach View',  user: currCoach, clients: clients});
});


/* POST homepage for coach. */
router.post('/coachView', requireLogin, upload.single('image'), async function(req, res) {
  console.log(req.body);
  console.log(req.session);
  currCoach = req.session.user;
  clients = req.session.user.executives;

    if (req.body.emailReminder != null) { //the coach has chosen to send a reminder to a specific executive
        await emailservices.sendOneReminder(req.body.emailReminder);
        res.render('coachView.pug', {title: 'CoachView', user: req.session.user, clients: req.session.user.executives});
    } else if (req.body.addCoachGoal != null) { //the coach has chosen to add a goal to executive(s)
      var data2 = qs.parse(req.body);
      if (data2.goalTitle != "") {
        await addGoalService.addGoalCoach(data2, currCoach, clients);
      } else {
        console.log(data2.GoalButton);
        console.log(req.body.GoalButton);
        await addGoalService.addPrevGoal(data2, req.body.GoalButton, currCoach, clients);
      }
      res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
    } else if (req.body.acceptRequest != null) { //approving a client's progress update
        console.log("this is the client's goal ID" + req.body.acceptRequest);
        console.log("ABOUT TO CALL ACCEPTPORGRESSUPDATE IN COACHVIEW");
        await addGoalService.acceptProgressUpdate(req.body.acceptRequest);
        clients = await loginservices.getClientGoals(user);
        res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
        //res.redirect('coachView');
    } else { //sending an email to invite a client
        console.log("in email")
        
        var name = req.body.clientName;
        var email = req.body.emailAddress;
        var message = req.body.message;
  	    await emailservices.sendEmail(currCoach, name, email, message);
        res.redirect('/coachView');
    }
});

router.post('/coachSignUpAction', upload.single('image'), async function(req, res) {
  if (req.body.fname != null) { //if it is not null, we know we will be signing up a coach
    //Mike - removed this line as it caused the page to hang if you tried to sign up a user while still logged in, there may be a more elegant way to do this
    //if (currCoach == null) {
        //the user (coach) is created in signUpCoach with the information in the form
        var image;
        if (req.file == null) {
          image = "https://user-images-leadership-artform.s3.us-west-2.amazonaws.com/1555710265346";
        } else {
          image = req.file.location;
        }
        user = await signup.signUpCoach(req.body.fname, req.body.lname,
          req.body.email, req.body.phone_number, req.body.password, req.body.confirmPassword, req.body.bio, image);
        console.log(user);
        // if (user == null) {
        if (user == -1) { //the two password fields do not match
          res.render('coachSignInSignUp.pug', { title: 'Coach Signup', signupMessage1: 'Passwords provided do not match! Try again.'});
        }
        else if (user == -2) { //the email has already been logged into the database and can not be reused
          res.render('coachSignInSignUp.pug', { title: 'Coach Signup', signupMessage1: 'Duplicate email! Try again or Login.'});
        }
        // }
        else {
          var promise = Promise.resolve(user);
          promise.then(function(value) {
            currCoach = user;
            var clientList = [];
            req.session.user = user;
            res.redirect('/coachView');
          });

        }
    //}
  } 
});

router.post('/coachSignInAction', async function(req, res) {
  if (req.body.username != null) { //signin a user
    console.log("sign in started")
    user = await loginservices.getCoachAuthent(req.body.username, req.body.password);
    currCoach = user;
    console.log(currCoach);
    //the currCoach is mapped to the coach with the provided information.
    if (user == null) {   // auth passes null if username doesn't match pass
      res.render("index", { title: 'Art of Leadership', message: 'Incorrect email or password! Try again.' });
    }
    else {
      //Once logged in, the clients field will be populated with the coach's clients
      clients = await loginservices.getClientGoals(user);
      req.session.user = user;
      res.redirect('/coachView')
    }
  }
});

/* GET homepage for executive. */
router.get('/executiveView', requireLogin, async function(req,res,next){
    //map to the correct executive if executive's username and password are provided and log them in
    if(req.session.user.executive_id != undefined){
      res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
    }else{
      res.redirect('/coachView')
    }
});

/* POST homepage for execuctive. */
router.post('/executiveView', upload.single('image'), async function(req,res,next) {
  if (req.body.isEditGoalExec == 'yes'){ //marked as 'yes' if teh executive has entered a response
    var goal = await responseServices.getGoalWithID(req.body.goalID);
    var mcQuestionCount = req.body.mcQuestionCount;
    var likertQuestionCount = req.body.likertQuestionCount;
    //the response is added to the database
    await responseServices.addResponses(goal, req.body, mcQuestionCount, likertQuestionCount);

    //the deadline is moved up one week
    await responseServices.updateDeadline(goal);

    //the user is remapped to include all of its new responses and update currExecutive
    console.log("Sign in here 2");
    var user = await loginservices.getExecutiveAuthent(currExecutive.username, currExecutive.pass);
    currExecutive = user;
    console.log("Here4");
    res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
  }
  else if (req.body.progress != null){ //called when an executive tries to update the progress
    await addGoalService.updateProgress(req.body.goalID, req.body.progress);
    console.log("Here3");
    res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
  }

  if (currExecutive == null) {
    if (req.body.fname != null) { //called when the executive is trying to sign up
      //an executive is created with all of the form information
      var image;
      if (req.file == null) {
        image = "https://user-images-leadership-artform.s3.us-west-2.amazonaws.com/1555710265346";
      } else {
        image = req.file.location;
      }
      user = await signup.signUpExecutive(req.body.fname, req.body.lname,
      req.body.email,req.body.phone_number, req.body.password, req.body.confirmPassword, req.body.bio, image, req.body.coach_id);

      if (user == -1) { //enter if a duplicate email has been detected in the database
        res.render('executiveSignInSignUp.pug', { title: 'Executive Signup', signupMessage1: 'Duplicate email! Try again or Login.' });
      }
      if (user == -2) { //enter if the coach id provided is not valid
        res.render('executiveSignInSignUp.pug', { title: 'Executive Signup', signupMessage1: 'Coach ID does not exist! Try again.' });
      }
      if (user == -3) { //enter if the passwords provided do not match
        res.render('executiveSignInSignUp.pug', { title: 'Executive Signup', signupMessage1: 'Passwords provided do not match! Try again.' });
      }
      currExecutive = user;
    } else { //enter when the executive attempts to sign in
      console.log("Sign in here 1");
      user = await loginservices.getExecutiveAuthent(req.body.username2, req.body.password2);
      currExecutive = user;
    }
  }
  if (user == null && req.body.fname != null) {
    res.redirect('/executiveSignInSignUp');
  } else if (user == null && req.body.username2 != null) {  // auth passes null if username doesn't match pass
      res.render("index", { title:'Art of Leadership', message2: 'Incorrect email or password! Try again.' });
  } else if (req.body.deleteMessage != null) { //deleting a client's message
    var message = " ";
    await emailservices.updateMessage(message, currExecutive.username)
    currExecutive.coach_message = message;
    console.log("Here2");
    res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
  } else {
      // Successfully sign in as an executive
      console.log("Here1");
      res.render('executiveView.pug', {title: 'ExecutiveView', user: currExecutive});
  }
});

/* GET profile page for executive. */
router.get('/executiveProfile', async function(req,res,next){
  //populates the executive's profile with their past goals
  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);
	res.render('executiveProfile.pug', {title: 'Executive Profile', user: currExecutive, pastGoals: pastGoals});
});

/* POST profile page for executive. */
router.post('/executiveProfile', upload.single('image'), async function(req,res,next) {
  var newInfo = req.body;
  //allows the executive to edit their information
  var image;
  if (req.file == null) {
    image = "https://user-images-leadership-artform.s3.us-west-2.amazonaws.com/1555710265346";
  } else {
    image = req.file.location;
  }
  await profileServices.editExecutiveInfo(newInfo, currExecutive, image);

  res.redirect('/executiveProfile');
});

/* GET profile page for executive when logged in as coach. */
router.get('/executiveProfile_coach', async function(req,res,next){
  //populates the executive's profile with past goals on the coach's view
  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);
  res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: currExecutive, pastGoals: pastGoals});
});

/* POST profile page for executive when logged in as coach. */
router.post('/executiveProfile_coach', async function(req,res,next) {
  //retrieve the current executive's notes, past goals, and goals when logged in as the coach
  var notes;
  currExecutive = await loginservices.getExecutive(req.body.profileClick);

  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);

  var execGoals = await profileServices.getExecGoals(currExecutive.execID);
  currExecutive.exec_goals = execGoals;



  if (req.body.noteContent != null){ //enter when the coach tries to add note on executive
    await notesServices.addNote(req.body.currExecID, currCoach.coach_id_val, req.body.noteContent);
    notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id_val);
  } else if (req.body.sendMessage != null) { //sending a message to a client
    var message = req.body.clientMessage;
    var client = req.body.messageClient;
    //updates the client's message
    emailservices.updateMessage(message, client)
  }

  notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id_val);
  var promise = Promise.resolve(currExecutive);
  promise.then(function(value) {
    res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: value, notes: notes, pastGoals:pastGoals});
  });
});

/* GET profile page for coach when logged in as coach. */
router.get('/coachProfile_coach', requireLogin, async function(req,res,next){
  clients = await loginservices.getClientGoals(user);
	res.render('coachProfile_coach.pug', {title: 'Coach Profile', user: req.session.user, clients: req.session.user.executives});
});

/* POST profile page for coach when logged in as coach and uploads image correctly. */
router.post('/coachProfile_coach', upload.single('image'), async function(req,res,next) {
  var newInfo = req.body;
  var image;
  if (req.file == null) {
    image = "https://user-images-leadership-artform.s3.us-west-2.amazonaws.com/1555710265346";
  } else {
    image = req.file.location;
  }
  await profileServices.editCoachInfo(newInfo, currCoach, image);
  res.redirect('/coachProfile_coach');
  // res.render('executiveProfile.pug', {title: 'Executive Profile', user: currCoach});
});


/* GET profile page for coach when logged in as executive. */
router.get('/coachProfile_executive', async function(req,res,next){
  currCoach  = await loginservices.getExecutiveCoach(currExecutive);
  var promise = Promise.resolve(currCoach);
  promise.then(function(value) {
    res.render('coachProfile_executive.pug', {title: 'Coach Profile', user: value});
  });
});

/* POST profile page for coach when logged in as coach. */
router.post('/coachProfile_coach', function(req, res) {
  if (req.body.remindAll != null) { //if the remind all button is clicked, this will send a reminder to all clients
    emailservices.sendAllReminders(clients);
  } else { //this will invite a client to the web platform.
    var name = req.body.clientName;
    var email = req.body.emailAddress;
    var message = req.body.message;
    emailservices.sendEmail(name, email, message);
  }
	res.render('coachProfile_coach.pug', {title: 'Coach Profile'});
});

/* GET add goal page when logged in as coach. */
router.get('/addGoal_coach', async function(req,res,next){
  var clients2 = await loginservices.getClientGoals(currCoach);
  var promise = Promise.resolve(clients2);
  promise.then(function(value) {
    res.render('addGoal_coach.pug', {title: 'Add Goal', user:currCoach, clients:clients, clients2:value});
  });
});


/* GET add goal page when logged in as executive. */
router.get('/addGoal_executive', function(req,res,next){
	res.render('addGoal_executive.pug', {title: 'Add Goal'});
});


/* POST to start page.  */
router.post('/', function(req, res) {
  if (req.body.signOut != null) { //enter if a user chooses to sign out and set logged in information to null
    currExecutive = null;
    currCoach = null;
    clients = null;
    req.session.user = null;

    res.render('index', { title: 'Art of Leadership' });
  } else {
    var email = req.body.User;
    var password = req.body.Password;
    res.render('executiveView.pug', {title: 'Executive Profile', user: currExecutive});
  }
});


/* POST to edit goal page when logged in as executive. */
router.post('/editGoal_executive', async function(req, res) {
  if (req.body.isViewGoal == "yes"){ //if coming from viewGoal_executive
    var goal_id = req.body.goal_id;
    var goal = await responseServices.getGoalWithID(goal_id);
    var questions = await responseServices.getQuestions(goal_id);
    goal.goal_questions = questions;
    res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  }
  else {  //if coming from addGoal_executive
      var data = qs.parse(req.body);
      await addGoalService.addGoalExecutive(data, currExecutive);
      var goal = await addGoalService.viewGoalExecutive(data, currExecutive);
      //getClientsSelected() should grab the clients chosen in a goal form on addGoal_coach and then set clients: to that returned var

      res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  }
});


/* POST to view goal page when logged in as executive. */
router.post('/viewGoal_executive', async function(req, res) {
    console.log("WE ARE POSTING IN VIEW_GOAL EXEC" + req.body.goal_id);
    var goal = await addGoalService.getGoalWithId(req.body.goal_id);
    var currResponse;
    if (goal.goal_responses.length > 0) {
      currResponse = goal.goal_responses[0]
    }
    console.log("We are here");
    console.log(goal.progress_update + "!!");
    if (req.body.update_progress != null) {
      //the executive is requesting their progress be updated
      //it should not directly change the database until the coach has access to it
      await addGoalService.updateProgress(req.body.goal_id, req.body.progress);
    }
    res.render('viewGoal_executive.pug', {goal: goal, currResponse: currResponse});
});

/* POST to view goal page when logged in as coach. */
router.post('/viewGoal_coach', async function(req, res) {
    console.log("dis my id" + req.body.goal_id);
    var goal = await addGoalService.getGoalWithId(req.body.goal_id);
    var currResponse;
    if (goal.goal_responses.length > 0) { //this will populate the currResponse array with the goal's response
      currResponse = goal.goal_responses[0]
    }

    if (req.body.acceptRequest != null) { //approving a client's progress update
    } else if (req.body.coachChange != null) { //the coach is updating the client's progress manually
      console.log("inside coachChange!!!!");
      await addGoalService.updateProgressCoach(req.body.goal_id, req.body.progress);
    }

    res.render('viewGoal_coach.pug', {goal: goal, currResponse: currResponse});
});

module.exports = router;
