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

    var goal_id = goal.id;

    var responseArray = [];
    var mcQuestion = null;
    for (var i = 0; i < mcQuestionCount; i++){
      mcQuestion = "mcQuestion"+i;
      console.log("mcQuestion is " + mcQuestion);
      console.log("printing " + responses[mcQuestion])
      responseArray.push(responses[mcQuestion]);
    }

    var frResponse = responses.frResponse;
    var likertResponse = responses.likert;

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

    const [questionRows, questionFields] = await mysql.connect.execute("SELECT * FROM questions WHERE goal_id = ?", [goal_id]);
    const questionRowsArray = questionRows.map(x => new Question.Question(x));

    for (var j = 0; j < questionRowsArray.length; j++){       //goes through the questions for a given goal
      if (questionRowsArray[j].question_type == 0){           //if it is a multiple choice question
        console.log("questionRowsArray[j] is " + questionRowsArray[j].question_title);
        var qs = questionRowsArray[j].question_qs.split(','); //split the qs into options
        if (responseArray[j].includes("MC")){
          var mcOptionNum = responseArray[j].slice(2, 3);
          console.log("mcOptionNum is " + mcOptionNum);
          var mcOption = mcOptionNum - 1;
          var answer = qs[mcOption];
          console.log("putting questionID " + questionRowsArray[j].question_id + ", today as " + today + " and answer as " + answer);
          console.log("mcOption is " + mcOption);
          console.log("qs is " + qs);
          console.log("qs[mcOption] is " + qs[mcOption]);
          await mysql.connect.execute("INSERT INTO responses(question_id, response_date, answer) VALUES(?, ?, ?);", [questionRowsArray[j].question_id, today, answer]);
          //console.log("including " + qs[1] + " in the database");
          //console.log("going to include " + qs[mcOption] + " in the database");
        }
      }
      if (questionRowsArray[j].question_type == 1){
        var answer = responseArray[j];
        await mysql.connect.execute("INSERT INTO responses(question_id, response_date, answer) VALUES(?, ?, ?);", [questionRowsArray[j].question_id, today, answer]);
      }
      if (questionRowsArray[j].question_type == 2){
        //console.log("going to insert " + responseArray[j] + " for " + questionsArray[j].question_title);
        // if (responseArray[j].includes("L")){
        //   var answer = responseArray[j].slice(0,1);
        //   console.log(likertOption);
        //   console.log("going to insert " + likertOption + " for question " + questionRowsArray[j].question_title);
        // //  await mysql.connect.execute("INSERT INTO responses(question_id, response_date, answer) VALUES(?, ?, ?);", [questionRowsArray[j].question_id, today, answer]);
        // }
      }
    }
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
