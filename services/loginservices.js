/*****

loginservices.js allows express and node.js to interact with the database when the
executive or coach decides to log in.

****/

var mysql = require("./sqlconnect.js");
var bcrypt = require('bcrypt-nodejs');
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');
var Goal = require("../model/goal")
var Question = require("../model/question")
var currentExecutive;
var currentCoach;
var isCorrectPass = false;

module.exports = {

	/**
	getExecutiveAuthent:
	paramters- email, password
	purpose- Checks from the database for the correct email/password combination. If it does not match,
	the user will not be logged in. Otherwise, they will be redirected to their executiveView
	**/
	getExecutiveAuthent: async function(email, password) {
		const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase().trim()]);
		const currExecutive = rows.map(x => new Executive.Executive(x));
		if (rows != null) {
			if (rows.length != 0) {
				var pw = currExecutive[0].pass;
				const validPassword = bcrypt.compareSync(password, pw);
				if (validPassword) {
					isCorrectPass = true;
					currentExecutive = currExecutive[0];
					const [rows2, fields2] = await mysql.connect.execute("SELECT * FROM goals WHERE executive_id = IFNULL(?, executive_id)", [currentExecutive.executive_id]);
					const currGoalArray = rows2.map(x => new Goal.Goal(x));
					for (var i = 0; i < currGoalArray.length; i++) {
						currentExecutive.addGoal(currGoalArray[i]);
					}
				}
				else {
					console.log("Password doesn't match (inside loginservices)");
					currentExecutive = null;
				}
			}
			else {
				currentExecutive = null;
			}
		}
		else {
			currentExecutive = null;
		}
		return currentExecutive;
	},

	/**
	getClientGoals:
	paramters- coach
	purpose- Called when a coach is logged in. This returns all of their clients goals and helps to populate
	their view
	**/
	getClientGoals: async function(coach) {
		//Grab coach's executive list
		console.log(coach.coach_id)
		const [execRows, execFields] = await mysql.connect.execute("SELECT * FROM executives WHERE coach_id = IFNULL(?, coach_id)", [coach.coach_id]);
		console.log("firstLoop")
		const currExecutives = execRows.map(x => new Executive.Executive(x));
		console.log(currentExecutive.length)
		for (var i = 0; i < currExecutives.length; i++) {
			//Get each executive's list of goals
	    	const [goalRows, goalFields] = await mysql.connect.execute("SELECT * FROM goals WHERE executive_id = IFNULL(?, executive_id)", [currExecutives[i].executive_id]);
			const currGoalArray = goalRows.map(x => new Goal.Goal(x));
			console.log(currGoalArray.length)
			for (var j = 0; j < currGoalArray.length; j++) {
				const [questionRows, questionFields] = await mysql.connect.execute("SELECT * FROM questions WHERE goal_id = IFNULL(?, goal_id)", [currGoalArray[j].id]);
				const currQuestionArray = questionRows.map(x => new Question.Question(x));
				currGoalArray[j].goal_questions = currQuestionArray;
				currExecutives[i].addGoal(currGoalArray[j]);

			}
		}
		return currExecutives;
	},

	/**
	getCoachAuthent:
	paramters- email, password
	purpose- Checks from the database for the correct email/password combination. If it does not match,
	the user will not be logged in. Otherwise, they will be redirected to their coachView
	**/
	getCoachAuthent: async function(email, password) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase().trim()]);
			const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
			if (rows != null) {
	      if (rows.length != 0) {
					var pw = currCoach[0].pass;
					const validPassword = bcrypt.compareSync(password, pw);

					if (validPassword) {
						currentCoach = currCoach[0];
					}
					else {
						currentCoach = null;
					}
				}
				else {
					currentCoach = null;
				}
			} else {
				currentCoach = null;
			}
	    return currentCoach;
	},

	/**
	getClients:
	paramters- user
	purpose- Returns the clients of the signed in coach.
	**/
	getClients: async function(user) {
	    var id = user.coach_id_val;
	    console.log("ID HERE: " + id);
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE coach_id = IFNULL(?, coach_id)", [user.coach_id]);
	    const currCoach = rows.map(x => new Executive.Executive(x));
	    return currCoach;
  	},

	/**
	getExecutiveCoach:
	paramters- executive
	purpose- Returns the coach that is mapped to the executive.
	**/
	getExecutiveCoach: async function(executive) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE coach_id = IFNULL(?, coach_id)", [executive.coach_id]);
	    const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
	    return currCoach[0];
	},

	/**
	getExecutive:
	paramters- email
	purpose- Returns the executive that is mapped to the email provided.
	**/
	getExecutive: async function(email) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase().trim()]);
	    const currExecutive = rows.map(x => new Executive.Executive(x));
	    return currExecutive[0];
	}
};
