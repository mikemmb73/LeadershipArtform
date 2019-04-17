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
		var newMessage = "Dear " + name + ", " + "<br>" + message + "<br>" + "Your coach's ID is " + currCoach.coach_id + ". You'll need this to sign up. ";
		newMessage += "Please go to http://productionv1.j5zacpxzt4.us-west-2.elasticbeanstalk.com/executiveSignup to sign up as an executive.";

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
		      Data: currCoach.fname + ' ' + currCoach.lname + ' has invited you to join Leadership as an Artform!'
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
	sendAllReminders:
	paramters- clients
	purpose- The currCoach will send an email notification to all of their clients to remind them to complete
	their goals for the week
	**/
	sendAllReminders: function(clients) {
		console.log("EMAIL CLIENTS");
		console.log(clients);
		clients.forEach(function(entry) {
			var message = "Your coach has sent you a reminder to complete your goals. Please log on to Leadership as an Artform to complete any tasks. http://productionv1.j5zacpxzt4.us-west-2.elasticbeanstalk.com/"
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
			      Data: 'Leadership as an Artform Reminder'
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
		var message = "Your coach has sent you a reminder to complete your goals. Please log on to Leadership as an Artform to complete any tasks. http://productionv1.j5zacpxzt4.us-west-2.elasticbeanstalk.com/"
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
		      Data: 'Leadership as an Artform Reminder'
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

  sendReminderEmails: async function() {
    const [rows, field] = await mysql.connect.execute("SELECT * FROM goals");
    if (rows != null) {
      const allGoals = rows.map(x => new Goal.Goal(x));
      allGoals.forEach(async function(entry) {
        if (entry.goal_progress == 100) { // do not send email because goal is completed
          return;
        }
        if (entry.goal_frequency == 1) { // check if weekly
          var currDate = Date.now();
          currDate.setHours(0,0,0,0);
          var timeDiff = Date.now().getTime() - entry.goal_date;
          if (timeDiff % 604800000 != 0) { // not time for reminder
            return;
          }
        }
        if (entry.goal_frequency == 2) { // check if bi-weekly
          var currDate = Date.now();
          currDate.setHours(0,0,0,0);
          var timeDiff = Date.now().getTime() - entry.goal_date;
          if (timeDiff % 1209600000 != 0) { // not time for reminder
            return;
          }
        }
        if (entry.goal_frequency == 3) { // check if monthly
          var currDate = Date.now();
          currDate.setHours(0,0,0,0);
          var timeDiff = Date.now().getTime() - entry.goal_date;
          if (timeDiff % 2592000000 != 0) { // not time for reminder (month is calculated as 30 days flat)
            return;
          }
        }
        const [row, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE executive_id = ?", [entry.goal_exec_id]);
        const allExec = rows.map(x => new Executive.Executive(x));
        const exec = allExec[0];
        var message = "This is an automatic reminder to fill out a response for your goal:" + entry.goal_title + ". Please log on to Leadership as an Artform to complete your response. http://productionv1.j5zacpxzt4.us-west-2.elasticbeanstalk.com/"
        var newMessage = "Hello, " + "<br>" + message;

        // Create sendEmail params
        var params = {
          Destination: { /* required */
            // CcAddresses: [
            //   'EMAIL_ADDRESS',
            //   /* more items */
            // ],
            ToAddresses: [
              exec.username,
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
              Data: 'Leadership as an Artform Reminder'
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

      }
    }
};
