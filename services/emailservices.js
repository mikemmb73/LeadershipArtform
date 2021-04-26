/*****

emailservices.js allows express and node.js to interact with the database when the
coach wishes to send notifications via email.

****/

var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const schedule = require('node-schedule');

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_ID,
  region: 'us-west-2'
});

module.exports = {
	/**
	sendEmail:
	paramters- currCoach, name, email, message
	purpose- The currCoach will send an email from leadershipartform@gmail.com to the designated client.
	The email field indicates the desired executive's email address that the email will be sent to. They are
	able to customize a welcome message as well.
	**/
	sendEmail: function(currCoach, name, email, message) {
		console.log("in function");
		if(currCoach != null){
			var newMessage = "Dear " + name + ", " + "<br>" + message + "<br>" + "Your coach's ID is " + currCoach.coach_id + ". You'll need this to sign up. ";
			newMessage += "Please go to https://leadersmeetgoals.com/executiveSignInSignUp to sign up as an executive.";

			// Create sendEmail params
			var params = {
			Destination: { /* required */
				// CcAddresses: [
				//   'EMAIL_ADDRESS',
				//   /* more items */
				// ],
				ToAddresses: [
				email,
				/* more items */
				]
			},
			Message: { /* required */
				Body: { /* required */
				Html: {
				Charset: "UTF-8",
				Data: newMessage
				},
				Text: {
				Charset: "UTF-8",
				Data: "TEXT_FORMAT_BODY"
				}
				},
				Subject: {
				Charset: 'UTF-8',
				Data: currCoach.fname + ' ' + currCoach.lname + ' has invited you to join Art of Leadership!'
				}
				},
			Source: 'leadershipartform@gmail.com', /* required */
			ReplyToAddresses: [
				'leadershipartform@gmail.com',
				/* more items */
			],
			};
			var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
			sendPromise.then(
			function(data) {
				console.log(data.MessageId);
			}).catch(
				function(err) {
				console.error(err, err.stack);
			});
		}else{
			console.log("coach data passed unsuccessfully")
		}

	},

	/**
	sendAllReminders:
	paramters- clients
	purpose- The currCoach will send an email notification to all of their clients to remind them to complete
	their goals for the week
	**/
	sendAllReminders: function(clients) {
		console.log("EMAIL CLIENTS");
		console.log(clients);
		clients.forEach(function(entry) {
			var message = "Your coach has sent you a reminder to complete your goals. Please log on to Art of Leadership to complete any tasks. https://leadersmeetgoals.com"
			var newMessage = "Hello, " + "<br>" + message;

			// Create sendEmail params
			var params = {
			  Destination: { /* required */
			    // CcAddresses: [
			    //   'EMAIL_ADDRESS',
			    //   /* more items */
			    // ],
			    ToAddresses: [
			      entry.email,
			      /* more items */
			    ]
			  },
			  Message: { /* required */
			    Body: { /* required */
			      Html: {
			       Charset: "UTF-8",
			       Data: newMessage
			      },
			      Text: {
			       Charset: "UTF-8",
			       Data: "TEXT_FORMAT_BODY"
			      }
			     },
			     Subject: {
			      Charset: 'UTF-8',
			      Data: 'Art of Leadership Reminder'
			     }
			    },
			  Source: 'leadershipartform@gmail.com', /* required */
			  ReplyToAddresses: [
			     'leadershipartform@gmail.com',
			    /* more items */
			  ],
			};
			var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
			sendPromise.then(
			  function(data) {
			    console.log(data.MessageId);
			  }).catch(
			    function(err) {
			    console.error(err, err.stack);
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
		var message = "Your coach has sent you a reminder to complete your goals. Please log on to Art of Leadership to complete any tasks. https://leadersmeetgoals.com"
		var newMessage = "Hello, " + "<br>" + message;

		// Create sendEmail params
		var params = {
		  Destination: { /* required */
		    // CcAddresses: [
		    //   'EMAIL_ADDRESS',
		    //   /* more items */
		    // ],
		    ToAddresses: [
		      email,
		      /* more items */
		    ]
		  },
		  Message: { /* required */
		    Body: { /* required */
		      Html: {
		       Charset: "UTF-8",
		       Data: newMessage
		      },
		      Text: {
		       Charset: "UTF-8",
		       Data: "TEXT_FORMAT_BODY"
		      }
		     },
		     Subject: {
		      Charset: 'UTF-8',
		      Data: 'Art of Leadership Reminder'
		     }
		    },
		  Source: 'leadershipartform@gmail.com', /* required */
		  ReplyToAddresses: [
		     'leadershipartform@gmail.com',
		    /* more items */
		  ],
		};
		var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
		sendPromise.then(
		  function(data) {
		    console.log(data.MessageId);
		  }).catch(
		    function(err) {
		    console.error(err, err.stack);
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
	},

	getMessage: async function(email) {
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
	},

  scheduleReminder: function(email, frequency) {
    // let today = new Date();
    // const startTime = new Date(today.now() + 1000 * 60);
    // const endTime = new Date(startTime.getTime() + 1000 * 60 * 60 * 24 * 30);
    // const rule = '';
    // if (frequency == 1) {
    //   rule = '0 0 9 * * *';
    // } else if (frequency == 7) {
    //   rule = '0 0 9 * * 1';
    // } else if (frequency == 30) {
    //   rule = '0 0 9 1 * *';
    // }

    let today = new Date();
    const startTime = new Date(today.getTime() + 1000 * 10);
    const endTime = new Date(startTime.getTime() + 1000 * 60 * 3);
    var rule = '';
    if (frequency == 1) {
      rule = '10 * * * * *';
    } else if (frequency == 7) {
      rule = '0 0 9 * * 1';
    } else if (frequency == 30) {
      rule = '0 0 9 1 * *';
    }

    const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: rule}, function(email) {
  		var message = "Your coach has sent you a reminder to complete your goals. Please log on to Art of Leadership to complete any tasks. https://leadersmeetgoals.com"
  		var newMessage = "Hello, " + "<br>" + message;

  		// Create sendEmail params
  		var params = {
  		  Destination: { /* required */
  		    // CcAddresses: [
  		    //   'EMAIL_ADDRESS',
  		    //   /* more items */
  		    // ],
  		    ToAddresses: [
  		      email,
  		      /* more items */
  		    ]
  		  },
  		  Message: { /* required */
  		    Body: { /* required */
  		      Html: {
  		       Charset: "UTF-8",
  		       Data: newMessage
  		      },
  		      Text: {
  		       Charset: "UTF-8",
  		       Data: "TEXT_FORMAT_BODY"
  		      }
  		     },
  		     Subject: {
  		      Charset: 'UTF-8',
  		      Data: 'Art of Leadership Reminder'
  		     }
  		    },
  		  Source: 'leadershipartform@gmail.com', /* required */
  		  ReplyToAddresses: [
  		     'leadershipartform@gmail.com',
  		    /* more items */
  		  ],
  		};
  		var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  		sendPromise.then(
  		  function(data) {
  		    console.log(data.MessageId);
  		  }).catch(
  		    function(err) {
  		    console.error(err, err.stack);
  		  });
        console.log("Done reminder");
      })
  }
};
