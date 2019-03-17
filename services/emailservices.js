module.exports = {
	sendEmail: function(name, email, message) {
		console.log("in function"); 
		var nodemailer = require('nodemailer');
		var newMessage = "Dear " + name + ", " + "\n" + message; 

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
		  subject: 'You have been invited to join Leadership as an Artform!',
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

	}
}; 