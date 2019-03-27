var mysql = require("./sqlconnect.js");
var Executive = require("../model/executive");
var QResponse = require("../model/qresponse");
var Question = require("../model/question");
var Goal = require("../model/goal");

module.exports = {

  getGoalWithID: async function(goalID){
    const [goalRows, goalFields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    const goalRowsArray = goalRows.map(x => new Goal.Goal(x));
    console.log("returning goal " + goalRowsArray[0]);
    return goalRowsArray[0];
  },

  getNumQuestions: async function(goal_id){
    const [questionRows, questionFields] = await mysql.connect.execute("SELECT * FROM questions WHERE goal_id = ?", [goal_id]);
    const questionRowsArray = questionRows.map(x => new Question.Question(x));
    console.log("questionRowsArray length is " + questionRowsArray.length);
    return questionRowsArray.length;


  },

  addResponses: async function(goal, responses, mcQuestionCount) {
    console.log("made it");
    console.log("mcQuestionCount is " + mcQuestionCount);
    var goal_id = goal.id;

    var responseArray = [];
    var mcQuestion = null;
    for (var i = 1; i < mcQuestionCount; i++){
      mcQuestion = "mcQuestion"+i+1;
      console.log("in here only once and mcQuestion is " + mcQuestion);
      console.log("printing " + responses[mcQuestion])
      //responseArray.push(responses.mcQuestionCount[i]);
    }
    // var mcResponse = responses.mcQuestio
    var frResponse = responses.frResponse;
    var likertResponse = responses.likert;
    // if (mcResponse instanceof Array){
    //   for (var i = 0; i < mcResponse.length; i++){
    //     responseArray.push(mcResponse[i]);
    //   }
    // }
    // else {
    //   responseArray.push(mcResponse);
    // }
    if (frResponse instanceof Array){
      for (var i = 0; i < frResponse.length; i++){
        responseArray.push(frResponse[i]);
      }
    }
    else if (frResponse != null){
      responseArray.push(frResponse);
    }
    if (likertResponse instanceof Array){
      for (var i = 0; i < likertResponse.length; i++){
        likertArray.push(likertResponse[i]);
      }
    }
    else if (likertResponse != null){
      responseArray.push(likertResponse);
    }
    console.log("responseArray:");
    console.log(responseArray);

    var today = new Date();

    // const [questionRows, questionFields] = await mysql.connect.execute("SELECT * FROM questions WHERE goal_id = ?", [goal_id]);
    // const questionRowsArray = questionRows.map(x => new Question.Question(x));
    //
    // for (var i = 0; i < questionRowsArray.length; i++){
    //   var question_id = questionRowsArray[i].question_id;
    //   if (mcResponse)
    // }
    //
    //
    // await mysql.connect.execute("INSERT INTO responses(question_id, response_date, answer) VALUES(?, ?, ?);", [questionID, today, answer]);

  }
};
