/*****

emailservices.js allows express and node.js to interact with the database when the 
coach wishes to send notifications via email. 

****/ 

var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');

module.exports = {
	/**
	sendEmail:
	paramters- currCoach, name, email, message
	purpose- The currCoach will send an email from leadershipartform@gmail.com to the designated client. 
	The email field indicates the desired executive's email address that the email will be sent to. They are
	able to customize a welcome message as well.

	TODO:   
	notes- Currently, this is implemented using nodemailer, which is not supported by AWS. We are currently
	awaiting approval to use the AWS email service 
	**/
	sendEmail: function(currCoach, name, email, message) {
		console.log("in function");
		var nodemailer = require('nodemailer');
		var newMessage = "Dear " + name + ", " + "\n" + message + "\n" + "Your coach's ID is " + currCoach.coach_id + ". You'll need this to sign up";

		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'leadershipartform@gmail.com',
		    pass: 'leadership401'
		  }
		});

		var mailOptions = {
		  from: 'leadershipartform@gmail.com',
		  to: email,
		  subject: currCoach.fname + ' ' + currCoach.lname + ' has invited you to join Leadership as an Artform! Please go to this website and sign up as an executive.',
		  text: newMessage
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
	},

	/**
	sendAllReminders:
	paramters- clients
	purpose- The currCoach will send an email notification to all of their clients to remind them to complete
	their goals for the week 

	TODO:   
	notes- Currently, this is implemented using nodemailer, which is not supported by AWS. We are currently
	awaiting approval to use the AWS email service 
	**/
	sendAllReminders: function(clients) {
		console.log("EMAIL CLIENTS");
		console.log(clients);
		clients.forEach(function(entry) {
			var nodemailer = require('nodemailer');
			var message = "Your coach has sent you a reminder to complete your goals. Please log on to Leadership as an Artform to complete any tasks."
			var newMessage = "Hello, " + "\n" + message;

			var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
			    user: 'leadershipartform@gmail.com',
			    pass: 'leadership401'
			  }
			});

			var mailOptions = {
			  from: 'leadershipartform@gmail.com',
			  to: entry.email,
			  subject: 'Leadership as an Artform: Goal Reminder',
			  text: newMessage
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		 });

	},

	/**
	sendOneReminder
	paramters- client
	purpose- The currCoach will send an email notification to the specified client to remind them to complete
	their goals for the week 

	TODO:   
	notes- Currently, this is implemented using nodemailer, which is not supported by AWS. We are currently
	awaiting approval to use the AWS email service 
	**/
	sendOneReminder: function(email) {
		var nodemailer = require('nodemailer');
		var message = "Your coach has sent you a reminder to complete your goals. Please log on to Leadership as an Artform to complete any tasks."
		var newMessage = "Hello, " + "\n" + message;

		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'leadershipartform@gmail.com',
		    pass: 'leadership401'
		  }
		});

		var mailOptions = {
		  from: 'leadershipartform@gmail.com',
		  to: email,
		  subject: 'Leadership as an Artform: Goal Reminder',
		  text: newMessage
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});

	},

	/**
	updateMessage:
	paramters- message, email
	purpose- The currCoach will be able to send their client a message, which will update the 
	specified executive's message field in the database and show up when they next log in. 
	**/
	updateMessage: async function(message, email) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
	    if (rows != null) {
	      const currExec = rows.map(x => new Executive.Executive(x));
	      const exec = currExec[0];
	      var id = exec.execID; 
		  // var statement = "UPDATE executives SET message = YOO WHERE executive_id = " + id; 
		  await mysql.connect.execute("UPDATE executives SET message = ? WHERE executive_id = ?", [message, id]); 
	      console.log("I am setting the coach's message");
	      exec.coach_message = message; 
	      console.log("CURRENT COACH NOW HAS THIS MESSAGE" + exec.coach_message); 
	      return exec; 
	    }
	}
};
