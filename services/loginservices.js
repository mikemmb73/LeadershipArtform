var mysql = require("./sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');
var Goal = require("../model/goal")
var Question = require("../model/question")
var currentExecutive;

module.exports = {


	getExecutiveAuthent: async function(email, password) {
	    const [rows, fields] = await mysql.connect.execute("SELECT * FROM executives WHERE email = ?", [email.toLowerCase()]);
			const currExecutive = rows.map(x => new Executive.Executive(x));
			if (rows != null) {
	      if (rows.length != 0) {
	        currentExecutive = currExecutive[0];
					var pw = currentExecutive.pass;
					if (pw == password) {
						return currentExecutive;
					}
					else console.log("PASSWORD DOESNT MATCH");
	      }
	    }
	    return currentExecutive[0];
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
	    if (rows != null) {		// textbox not empty
	      if (rows.length != 0) {		// email entry found
	        const currCoach = rows.map(x => new ExecutiveCoach.ExecutiveCoach(x));
	        currentCoach = currCoach[0];
					var pw = currentCoach.pass;
					if (pw == password) {		// password entered = password in db
						return currCoach[0];
					}
					else console.log("PASSWORD DOESNT MATCH");
	      }
	    }
	    return null;
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
