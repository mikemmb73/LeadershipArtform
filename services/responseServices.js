var Executive = require("../model/executive");
var QResponse = require("../model/qresponse");
var Question = require("../model/question");
var Goal = require("../model/goal");
var mysql = require("./sqlconnect.js");

module.exports = {

  getGoalWithID: async function(goalID){
    const [goalRows, goalFields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    const goalRowsArray = goalRows.map(x => new Goal.Goal(x));
    console.log("returning goal " + goalRowsArray[0]);
    return goalRowsArray[0];
  },

  getQuestions: async function(goal_id){
    const [goalRows, goalFields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goal_id]);
    const goalRowsArray = goalRows.map(x => new Goal.Goal(x));
    var goal =  goalRowsArray[0];
    const [questionRows, questionFields] = await mysql.connect.execute("SELECT * FROM questions WHERE goal_id = ?", [goal_id]);
    const questionRowsArray = questionRows.map(x => new Question.Question(x));
    return questionRowsArray;
  },


  addResponses: async function(goal, responses, mcQuestionCount, likertQuestionCount) {

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
    var likertResponse = responses.likert0;

    if (frResponse instanceof Array){
      for (var i = 0; i < frResponse.length; i++){
        responseArray.push(frResponse[i]);
      }
    }
    else if (frResponse != null){
      responseArray.push(frResponse);
    }

    console.log("LIKERT QUESTION COUNT" )
    for (var i = 0; i < likertQuestionCount; i++){
      likertQuestion = "likert"+i;
      console.log("likert is " + likertQuestion);
      console.log("printing " + responses[likertQuestion])
      responseArray.push(responses[likertQuestion]);
    }

    console.log("response array value: " + responseArray);

    // if (likertResponse instanceof Array){
    //   console.log("instance of array");
    //   for (var i = 0; i < likertResponse.length; i++){
    //     var targetLikert = 'likert' + i;

    //     likertArray.push(likertResponse[i]);
    //   }
    // }
    // else if (likertResponse != null){
    //   responseArray.push(likertResponse);
    // }

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
          goal.goal_responses = answer;
          // questionRowsArray[j].answer_array(answer);
          // console.log("HEY" + questionRowsArray[j].answer_array);
          await mysql.connect.execute("INSERT INTO responses(question_id, goal_id, response_date, answer) VALUES(?, ?, ?, ?);", [questionRowsArray[j].question_id, goal_id, today, answer]);
          //console.log("including " + qs[1] + " in the database");
          //console.log("going to include " + qs[mcOption] + " in the database");
        }
      }
      if (questionRowsArray[j].question_type == 1){
        var answer = responseArray[j];
        goal.goal_responses = answer;
        // questionRowsArray[j].answer_array(answer);
        await mysql.connect.execute("INSERT INTO responses(question_id, goal_id, response_date, answer) VALUES(?, ?, ?, ?);", [questionRowsArray[j].question_id, goal_id, today, answer]);
      }
      if (questionRowsArray[j].question_type == 2){
        // for (var k = 0; k < responseArray.length; k++) {
          var answer = responseArray[j].substring(0,1);
          goal.goal_responses = answer;
          // questionRowsArray[j].answer_array(answer);
          await mysql.connect.execute("INSERT INTO responses(question_id, goal_id, response_date, answer) VALUES(?, ?, ?, ?);", [questionRowsArray[j].question_id, goal_id, today, answer]);
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
