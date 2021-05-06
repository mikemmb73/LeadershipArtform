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
const Response = require('../model/response').Response;
const QResponse = require('../model/qresponse').QResponse;
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
  } else if(req.session.user.executive_id != undefined){
    res.redirect('/');
  } else {
    next();
  }
};

function requireExecLogin(req, res, next){
  if (!req.session.user) {
    res.redirect('/');
  }else if(req.session.user.executive_id == undefined){
    res.redirect('/');
  }else{
    next();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  currCoach = null;
  currExecutive = null;
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
router.get('/coachView', requireLogin, function(req, res, next) {
  if (req.body.remindAll != null) {
    emailservices.sendAllReminders(clients);
  }

if (clients === undefined) {
  clients = [];
}
  res.render('coachView.pug', { title: 'Coach View',  user: req.session.user, clients: clients});
});


/* POST homepage for coach. */
router.post('/coachView', requireLogin, upload.single('image'), async function(req, res) {
  console.log(req.body);
  console.log(req.session);
  if(typeof req.session.user.coach_id === 'number'){
    currCoach = req.session.user;
    clients = req.session.user.executives;

    if (req.body.emailReminder != null) { //the coach has chosen to send a reminder to a specific executive
        await emailservices.sendOneReminder(req.body.emailReminder);
        res.render('coachView.pug', {title: 'CoachView', user: req.session.user, clients: req.session.user.executives});
    } else if (req.body.addCoachGoal != null) { //the coach has chosen to add a goal to executive(s)
      var data2 = qs.parse(req.body);
      console.log("frequency: " + req.body.frequency);


      clients = await loginservices.getClients (req.session.user);

      if (data2.goalTitle != "") {
        await addGoalService.addGoalCoach(data2, currCoach, clients, req.body.frequency);
      } else {
        console.log(data2.GoalButton);
        console.log(req.body.GoalButton);
        await addGoalService.addPrevGoal(data2, req.body.GoalButton, currCoach, clients, req.body.frequency);
      }
      res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
    } else if (req.body.acceptRequest != null) { //approving a client's progress update
        console.log("this is the client's goal ID" + req.body.acceptRequest);
        console.log("ABOUT TO CALL ACCEPTPORGRESSUPDATE IN COACHVIEW");
        await addGoalService.acceptProgressUpdate(req.body.acceptRequest);
        clients = await loginservices.getClientGoals(req.session.user);
        res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
        //res.redirect('coachView');
    } else { //sending an email to invite a client
        console.log("in email")

        var name = req.body.clientName;
        var email = req.body.emailAddress;
        var message = req.body.message;
  	    await emailservices.sendEmail(currCoach, name, email, message);
        res.render('coachView.pug', {title: 'CoachView', user: currCoach, clients: clients});
    }
  }else{
    res.redirect('/');
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
        // if (user == null) {
        if (user == -1) { //the two password fields do not match
          res.render('coachSignInSignUp.pug', { title: 'Coach Signup', SignUpErrorMessage: 'Passwords provided do not match! Try again.'});
        }
        else if (user == -2) { //the email has already been logged into the database and can not be reused
          res.render('coachSignInSignUp.pug', { title: 'Coach Signup', SignUpErrorMessage: 'Duplicate email! Try again or Login.'});
        }
        // }
        else {
          var promise = Promise.resolve(user);
          promise.then(function(value) {
            currCoach = user;
            var clients = []
            req.session.user = user;
            req.session.user.password = "";
            if(clients == null){
              clients = []
            }

            res.render('coachView.pug', {title: 'Coach Signin', user: req.session.user, clients: clients})
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
      res.render("coachSignInSignUp.pug", { title: 'Coach Signin', SignInErrorMessage: 'Incorrect email or password! Try again.' });
    }
    else {
      //Once logged in, the clients field will be populated with the coach's clients
      req.session.user = user;
      req.session.user.password = "";
      if(clients == null){
        clients = []
      }
      req.session.user.clients = await loginservices.getClients(req.session.user);

      res.render('coachView.pug', {user:req.session.user, clients: clients})
    }
  }
});

/* GET homepage for executive. */
router.get('/executiveView', requireExecLogin, async function(req,res,next){
    //map to the correct executive if executive's username and password are provided and log them in
    if(req.session.user.executive_id != undefined){
      if(req.session.user.coach_message == undefined){
        req.session.user.coach_message = "";
      }
      var exec_goals = await profileServices.getExecGoals(req.session.user.executive_id);
      req.session.user.exec_goals = exec_goals;

      res.render('executiveView.pug', {title: 'Executive View', user: req.session.user});
    }
});

/* POST for exec sign up */
router.post('/execSignUpAction', upload.single('image'), async function(req,res,next){
  if (currExecutive == null) {
    if (req.body.fname != null) { //called when the executive is trying to sign up
      //an executive is created with all of the form information
      var image;
      if (req.file == null) {
        image = "https://user-images-leadership-artform.s3.us-west-2.amazonaws.com/1555710265346";
      } else {
        image = req.file.location;
      }
      console.log(req.body);
      user = await signup.signUpExecutive(req.body.fname, req.body.lname,
      req.body.email,req.body.phone_number, req.body.password, req.body.confirmPassword, req.body.bio, image, req.body.coach_id);

      if (user == -1) { //enter if a duplicate email has been detected in the database
        return res.render('executiveSignInSignUp.pug', { title: 'Executive Signup', SignUpErrorMessage: 'Duplicate email! Try again or Login.' });
      }
      if (user == -2) { //enter if the coach id provided is not valid
        return res.render('executiveSignInSignUp.pug', { title: 'Executive Signup', SignUpErrorMessage: 'Coach ID does not exist! Try again.' });
      }
      if (user == -3) { //enter if the passwords provided do not match
        return res.render('executiveSignInSignUp.pug', { title: 'Executive Signup', SignUpErrorMessage: 'Passwords provided do not match! Try again.' });
      }
      currExecutive = user;
      req.session.user = user;
      req.session.user.password = "";
      console.log("Here");
      var execGoals = await profileServices.getExecGoals(currExecutive.executive_id);
      req.session.user.exec_goals = execGoals;

      res.render('executiveView.pug', {title: 'ExecutiveView', user: req.session.user});
    }
  }
});

//POST to sign in executive
router.post('/execSignInAction', upload.single('image'), async function(req,res,next){
  if(req.body.username2 != null){ //enter when the executive attempts to sign in
    console.log("Sign in here 1");
    user = await loginservices.getExecutiveAuthent(req.body.username2, req.body.password2);

    if (user != null) {
      currExecutive = user;
      req.session.user = user;
      req.session.user.password = "";

      var execGoals = await profileServices.getExecGoals(currExecutive.executive_id);
      req.session.user.exec_goals = execGoals;

      if(req.session.user.coach_message == undefined){
        req.session.user.coach_message = "";
      }
    }
  }

  //check what happened during auth
  if (user == null && req.body.fname != null) {
    res.redirect('/executiveSignInSignUp');
  } else if (user == null && req.body.username2 != null) {  // auth passes null if username doesn't match pass
      res.render("executiveSignInSignUp", { title:'Art of Leadership', SignInErrorMessage: 'Incorrect email or password! Try again.' });
  }  else {
      // Successfully sign in as an executive
      console.log("Here1");

      res.render('executiveView.pug', {title: 'ExecutiveView', user: req.session.user});
  }
});


/* POST homepage for execuctive. */
router.post('/executiveView', requireExecLogin, upload.single('image'), async function(req,res,next) {
  currExecutive = req.session.user;
  //console.log()
  if (req.body.isEditGoalExec == 'yes'){ //marked as 'yes' if teh executive has entered a response

    var goal = await responseServices.getGoalWithID(req.body.goalID);
    var mcQuestionCount = req.body.mcQuestionCount;
    var likertQuestionCount = req.body.likertQuestionCount;
	console.log(req.body.mcQuestionCount);
    //the response is added to the database
    await responseServices.addResponses(goal, req.body, mcQuestionCount, likertQuestionCount);

    //the deadline is moved up one week
    await responseServices.updateDeadline(goal);
    var execGoals = await profileServices.getExecGoals(currExecutive.executive_id);
    req.session.user.exec_goals = execGoals;

    //console.log("Here4");
    //console.log(req.session.user)
    res.render('executiveView.pug', {title: 'Executive View', user: req.session.user});
  }
  else if (req.body.progress != null){ //called when an executive tries to update the progress
    await addGoalService.updateProgress(req.body.goalID, req.body.progress);
    console.log("Here3");
    res.render('executiveView.pug', {title: 'Executive View', user: currExecutive});
  }else if (req.body.deleteMessage != null) { //deleting a client's message
    var message = "";
    await emailservices.updateMessage(message, currExecutive.email)
    //currExecutive.coach_message = message;

    //req.session.user.coach_message = message;
    //req.session.user.message.length = 0;
	req.session.user.message = message;
	req.session.user.messageState = 0;
    var execGoals = await profileServices.getExecGoals(currExecutive.executive_id);
    req.session.user.exec_goals = execGoals;


    console.log("Here2");
    res.render('executiveView.pug', {title: 'Executive View', user: req.session.user});
  }
});

/* GET profile page for executive. */
router.get('/executiveProfile', requireExecLogin, async function(req,res,next){
  //populates the executive's profile with their past goals
  var pastGoals = await profileServices.getExecCompletedGoals(req.session.user.executive_id);
	res.render('executiveProfile.pug', {title: 'Executive Profile', user: req.session.user, pastGoals: pastGoals});
});

/* POST profile page for executive. */
router.post('/executiveProfile', requireExecLogin, upload.single('image'), async function(req,res,next) {
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
router.get('/executiveProfile_coach', requireLogin, async function(req,res,next){
  //populates the executive's profile with past goals on the coach's view
  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);
  res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: currExecutive, pastGoals: pastGoals});
});

/* POST profile page for executive when logged in as coach. */
//requireLogin checks to make sure user is logged in as a coach
router.post('/executiveProfile_coach', requireLogin, async function(req,res,next) {
  //retrieve the current executive's notes, past goals, and goals when logged in as the coach
  var notes;
  currCoach = req.session.user;

  currExecutive = await loginservices.getExecutive(req.body.profileClick);

  var pastGoals = await profileServices.getExecCompletedGoals(currExecutive.execID);

  var execGoals = await profileServices.getExecGoals(currExecutive.executive_id);
  currExecutive.exec_goals = execGoals;
  req.session.user.exec_goals = execGoals;

  var execGoals = await profileServices.getExecGoals(currExecutive.executive_id);
  req.session.user.exec_goals = execGoals;

  if (req.body.noteContent != null){ //enter when the coach tries to add note on executive
    await notesServices.addNote(currExecutive.executive_id, currCoach.coach_id, req.body.noteContent);
    notes = await notesServices.viewNotes(currExecutive.executive_id, currCoach.coach_id);
  } else if (req.body.sendMessage != null) { //sending a message to a client
    console.log("in message")
    var message = req.body.clientMessage;
    var client = req.body.messageClient;
    //updates the client's message
    emailservices.updateMessage(message, client)
  }

  notes = await notesServices.viewNotes(currExecutive.execID, currCoach.coach_id);
  var promise = Promise.resolve(currExecutive);
  promise.then(function(value) {
    res.render('executiveProfile_coach.pug', {title: 'Executive Profile', user: value, notes: notes, pastGoals:pastGoals});
  });
});

/* GET profile page for coach when logged in as coach. */
router.get('/coachProfile_coach', requireLogin, async function(req,res,next){
  clients = await loginservices.getClientGoals(req.session.user);
	res.render('coachProfile_coach.pug', {title: 'Coach Profile', user: req.session.user, clients: clients});
});

/* POST profile page for coach when logged in as coach and uploads image correctly. */
router.post('/coachProfile_coach', requireLogin, upload.single('image'), async function(req,res,next) {
  var newInfo = req.body;
  var image;
  if (req.file == null) {
    image = "https://user-images-leadership-artform.s3.us-west-2.amazonaws.com/1555710265346";
  } else {
    image = req.file.location;
  }
  await profileServices.editCoachInfo(newInfo, req.session.user, image);
  res.render('coachProfile_coach.pug', {title: 'Coach Profile', user: req.session.user, clients: clients});
  // res.render('executiveProfile.pug', {title: 'Executive Profile', user: currCoach});
});


/* GET profile page for coach when logged in as executive. */
router.get('/coachProfile_executive', requireExecLogin, async function(req,res,next){
  console.log("IN GET COACH VAL")
  console.log(req.session.user)
  currCoach  = await loginservices.getExecutiveCoach(req.session.user);
  var promise = Promise.resolve(currCoach);
  promise.then(function(value) {
    res.render('coachProfile_executive.pug', {title: 'Coach Profile', user: value});
  });
});

//THIS MAY NEED WORK
/* POST profile page for coach when logged in as coach. */
router.post('/coachProfile_coach', requireLogin, function(req, res) {
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
router.get('/addGoal_coach', requireLogin, async function(req,res,next){
  //check if the user logged in is a coach
  if(typeof req.session.user.coach_id === 'number'){
    currCoach = req.session.user;
    clients = await loginservices.getClients(req.session.user)
    var clients2 = await loginservices.getClientGoals(currCoach);
    var promise = Promise.resolve(clients2);
    promise.then(function(value) {
      res.render('addGoal_coach.pug', {title: 'Add Goal', user:req.session.user, clients:clients, clients2:value});
    });

  //if its not a coach then redirect back home (graceful error)
  }else{
    res.redirect('/');
  }
});


/* GET add goal page when logged in as executive. */
router.get('/addGoal_executive', requireExecLogin, function(req,res,next){
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
router.post('/editGoal_executive', requireExecLogin, async function(req, res) {
  if (req.body.isViewGoal == "yes"){ //if coming from viewGoal_executive
    var goal_id = req.body.goal_id;
    var goal = await responseServices.getGoalWithID(goal_id);
    var questions = await responseServices.getQuestions(goal_id);
    goal.goal_questions = questions;

    res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  }
  else {  //if coming from addGoal_executive
      var data = qs.parse(req.body);
      await addGoalService.addGoalExecutive(data, req.session.user);
      var goal = await addGoalService.viewGoalExecutive(data, req.session.user);
      //getClientsSelected() should grab the clients chosen in a goal form on addGoal_coach and then set clients: to that returned var

      res.render('editGoal_executive.pug', {title: 'View Goal', goal: goal});
  }
});


/* POST to view goal page when logged in as executive. */
router.post('/viewGoal_executive', async function(req, res) {
    console.log("WE ARE POSTING IN VIEW_GOAL EXEC" + req.body.goal_id);
    var goal = await addGoalService.getGoalWithId(req.body.goal_id);
    var currResponse;
    req.session.user = req.session.user;

    // //before we push the data to the frontend, we have to accomodate showing multipl responses per day
    // allGoals = []
    // //break up the individual responses into a full array of responses
    // for(i = 0; i < goal.goal_responses.length; i++){
    //   thisGoal = goal.goal_responses[i]

    //   for(j = 0; j < thisGoal.responses.length; j++){
    //     allGoals.push(thisGoal.responses[j])
    //   }
    // }

    // //make individual response objects for each response
    // allResponses = []

    // //loop through each Q resp
    // allGoals.forEach(function(thisQresp){
    //   var thisResponse = new Response();

    //   //set the data
    //   thisResponse.date = thisQresp.response_date
    //   thisResponse.responses = [thisQresp.answer]

    //   //add to the arr
    //   allResponses.push(thisResponse)
    // })

    if (goal.goal_responses.length > 0) {
      currResponse = goal.goal_responses[0]
    }

    // //add all of the responses to the main response pushed to the user
    // goal.responses = allResponses

    console.log("We are here");
    console.log(goal.progress_update + "!!");
    console.log(currResponse)
    console.log(goal)

    if (req.body.update_progress != null) {
      //the executive is requesting their progress be updated
      //it should not directly change the database until the coach has access to it
      await addGoalService.updateProgress(req.body.goal_id, req.body.progress);
    }

    res.render('viewGoal_executive.pug', {goal: goal, currResponse: currResponse,user: req.session.user });
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
