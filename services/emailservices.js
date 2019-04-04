var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');

module.exports = {
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

	updateMessage: async function(message, email) {
		var formatEmail = email.toLowerCase(); 
		console.log(formatEmail); 
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
	    }
	}
};
