var mysql = require("./sqlconnect.js");
var Executive = require("../model/executive");
var Note = require("../model/note");

module.exports = {
  viewNotes: async function(execID, coachID) {
    const [execRows, execFields] = await mysql.connect.execute("SELECT * FROM executives WHERE executive_id = ?", execID);
    const exec = execRows.map(x => new Executive.Executive(x));
  }
};



if (rows != null){
  const currGoalArray = rows.map(x => new Goal.Goal(x));
  const currGoal = currGoalArray[0];
  var getStatement = "SELECT * FROM questions WHERE goal_id = IFNULL(" + currGoal.id + ", goal_id)";
  const [questionRows, questionFields] = await mysql.connect.execute(getStatement);
  const currQuestionArray = questionRows.map(x => new Question.Question(x));
  currGoal.goal_questions = currQuestionArray;
  return currGoal;
}
