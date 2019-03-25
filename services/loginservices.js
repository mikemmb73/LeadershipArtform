var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');
var Goal = require("../model/goal")
var Question = require("../model/question")
var currentExecutive;
var currentCoach;
var isCorrectPass = false;

module.exports = {

	getExecutiveAuthent: async function(email, password) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
			const currExecutive = rows.map(x => new Executive.Executive(x));
			if (rows != null) {
	      if (rows.length != 0) {
					var pw = currExecutive[0].pass;
					if (pw == password) {
						isCorrectPass = true;
						currentExecutive = currExecutive[0];
					}
					else {
						console.log("Password doesn't match (inside loginservices)");
						currentExecutive = null;
					}
				}
			}
	    return currentExecutive;
	},

	getClientGoals: async function(coach) {
		//Grab coach's executive list
		var getStatement = "SELECT * FROM executives WHERE coach_id = IFNULL(" + coach.coach_id_val + ", coach_id)";
		const [execRows, execFields] = await mysql.connect.execute(getStatement);
		const currExecutives = execRows.map(x => new Executive.Executive(x));
		for (var i = 0; i < currExecutives.length; i++) {
			//Get each executive's list of goals
			var getStatement2 = "SELECT * FROM goals WHERE executive_id = IFNULL(" + currExecutives[i].executive_id + ", executive_id)";
	    const [goalRows, goalFields] = await mysql.connect.execute(getStatement2);
			const currGoalArray = goalRows.map(x => new Goal.Goal(x));
			for (var j = 0; j < currGoalArray.length; j++) {
				var getStatement3 = "SELECT * FROM questions WHERE goal_id = IFNULL(" + currGoalArray[j].id + ", goal_id)";
				const [questionRows, questionFields] = await mysql.connect.execute(getStatement3);
				const currQuestionArray = questionRows.map(x => new Question.Question(x));
				currGoalArray[j].goal_questions = currQuestionArray;
				console.log("currQuestionArray is " + currQuestionArray);
				currExecutives[i].addGoal(currGoalArray[j]);

			}
		}
		return currExecutives;
	},

	getCoachAuthent: async function(email, password) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM coaches WHERE email = ?", [email.toLowerCase()]);
			const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
			if (rows != null) {
	      if (rows.length != 0) {
					var pw = currCoach[0].pass;
					if (pw == password) {
						currentCoach = currCoach[0];
					}
					else {
						console.log("Password doesn't match (inside loginservices)");
						currentCoach = null;
					}
				}
			}
	    return currentCoach;
	},

	getClients: async function(user) {
	    var id = user.coach_id_val;
	    console.log("ID HERE: " + id);
	    var getStatement = "SELECT * FROM executives WHERE coach_id = IFNULL(" + user.coach_id_val + ", coach_id)";
	    const [rows, fields] = await mysql.connect.execute(getStatement);
	    const currCoach = rows.map(x => new Executive.Executive(x));
	    return currCoach;
  	},

	getExecutiveCoach: async function(executive) {
		var getStatement = "SELECT * FROM coaches WHERE coach_id = IFNULL(" + executive.coachID + ", coach_id)";
	    const [rows, fields] = await mysql.connect.execute(getStatement);
	    const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
	    return currCoach[0];
	},

	getExecutive: async function(email) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
	    const currExecutive = rows.map(x => new Executive.Executive(x));
	    return currExecutive[0];
	}
};
