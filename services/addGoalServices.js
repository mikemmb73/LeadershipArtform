var mysql = require("./sqlconnect.js");
var Goal = require("../model/goal")
var Question = require("../model/question")
// MC =0, FR = 1, L = 2
module.exports = {
  addGoalExecutive: async function(goalData, currExecutive) {
    var today = new Date();
    await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned) VALUES(?, ?, ?, ?, ?, ?, ?);", [-1,currExecutive.executive_id, goalData.goalTitle, "", 0, goalData.frequency, today]);
    console.log("added goal");
    // const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE executive_id = ?", [currExecutive.executive_id]);
    // var getStatement = "SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    // const [rows, fields] = await mysql.connect.execute(getStatement);
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    console.log(rows);
    const currGoalArray = rows.map(x => new Goal.Goal(x));
    const currGoal = currGoalArray[0];


    // console.log("BEfore we add it, this is the length of goals list " + currExecutive.goals_list.length);
    // currExecutive.addGoal(currGoal);
    // console.log("currGoal is " + currGoal.id + " and currExecutive is " + currExecutive.name);
    // console.log("THIS EXECUTIVES GOALS HAS " + currExecutive.goals_list.length + " goals");
    //console.log(goalData.mcQuestions.length);
    if (goalData.mcQuestions != null) {
      for (var i=0; i<goalData.mcQuestions.length; i++) {
        var choices = "";
        for (var j=1; j<goalData.mcQuestions[0].length; j++) {
          choices += goalData.mcQuestions[0][j] + ",";
        }
        await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, answer, qs) VALUES(?, ?, ?, ?, ?);", [currGoal.id ,goalData.mcQuestions[i][0], 0, "", choices]);
      }
    }
    if (goalData.frQuestions != null) {
      for (var i=0; i<goalData.frQuestions.length; i++) {
        await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, answer, qs) VALUES(?, ?, ?, ?, ?);", [currGoal.id ,goalData.frQuestions[i], 1, "", ""]);
      }
    }
    if (goalData.likertQuestions != null) {
      for (var i=0; i<goalData.likertQuestions.length; i++) {
        var choices = goalData.likertQuestions[i][1] + "," + goalData.likertQuestions[i][2];
        await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, answer, qs) VALUES(?, ?, ?, ?, ?);", [currGoal.id ,goalData.likertQuestions[i][0], 2, "", choices]);
      }
    }
  },

  viewGoalExecutive: async function(goalData, currExecutive) {
    console.log("====in viewGoalExecutive====")
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    if (rows != null){
      const currGoalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      var getStatement = "SELECT * FROM questions WHERE goal_id = IFNULL(" + currGoal.id + ", goal_id)";
      const [questionRows, questionFields] = await mysql.connect.execute(getStatement);
      const currQuestionArray = questionRows.map(x => new Question.Question(x));
      currGoal.goal_questions = currQuestionArray;
      return currGoal;
    }

    else{
      return null;
    }
  }

};
