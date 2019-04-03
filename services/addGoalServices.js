var mysql = require("./sqlconnect.js");
var Goal = require("../model/goal");
var Question = require("../model/question");
var QResponse = require("../model/qresponse");
var Response = require("../model/response");

// MC =0, FR = 1, L = 2
module.exports = {
  addGoalExecutive: async function(goalData, currExecutive) {
    var today = new Date();

    console.log("This is my goal data" + goalData.goalTitle); 
    console.log("This is my goal data" + goalData.goalTitle); 
    const [rowsTest, fieldsTest] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    if (rowsTest.length) {
      // console.log("IT IS NOT NULL");
      // console.log("TITLE: " + goalData.goalTitle);
      // console.log("EXEC ID: " + currExecutive.executive_id);
      return;
    }

    await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned) VALUES(?, ?, ?, ?, ?, ?, ?);", [-1,currExecutive.executive_id, goalData.goalTitle, goalData.goalDescription, 0, goalData.frequency, today]);

    // const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE executive_id = ?", [currExecutive.executive_id]);
    // var getStatement = "SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    // const [rows, fields] = await mysql.connect.execute(getStatement);
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    console.log(rows);
    const currGoalArray = rows.map(x => new Goal.Goal(x));
    const currGoal = currGoalArray[0];

    if (goalData.mcQuestions != null) {
      for (var i=0; i<goalData.mcQuestions.length; i++) {
        var choices = "";
        for (var j=1; j<goalData.mcQuestions[i].length; j++) {
          choices += goalData.mcQuestions[i][j] + ",";
        }
        await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.mcQuestions[i][0], 0, choices]);
      }
    }
    if (goalData.frQuestions != null) {
      for (var i=0; i<goalData.frQuestions.length; i++) {
        await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.frQuestions[i], 1, ""]);
      }
    }
    if (goalData.likertQuestions != null) {
      for (var i=0; i<goalData.likertQuestions.length; i++) {
        var choices = goalData.likertQuestions[i][1] + "," + goalData.likertQuestions[i][2];
        await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.likertQuestions[i][0], 2, choices]);
      }
    }
    var getStatement = "SELECT * FROM questions WHERE goal_id = IFNULL(" + currGoal.id + ", goal_id)";
    const [questionRows, questionFields] = await mysql.connect.execute(getStatement);
    const currQuestionArray = questionRows.map(x => new Question.Question(x));
    currExecutive.addGoal(currGoal); 
  },

  viewGoalExecutive: async function(goalData, currExecutive) {
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
  },

  updateProgress: async function(goalID, progressValue) {
    console.log("updateProgress" + goalID + " " + progressValue); 
    var statement = "UPDATE goals SET progress = " + progressValue + " WHERE goal_id = " + goalID; 
    await mysql.connect.execute(statement); 
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    if (rows != null) {
      console.log("I am setting the progress value of the goal");
      const currGoalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      console.log("CURRENT GOAL HAD THIS PROGRESS" + currGoal.goal_progress); 
      currGoal.goal_progress = progressValue; 
      console.log("CURRENT GOAL NOW HAS THIS PROGRESS" + currGoal.goal_progress); 
    }
  }, 

  getGoalWithId: async function(goal_id) {
    const [rows, fields] = await mysql.connect.execute("SELECT * from goals WHERE goal_id = ?", [goal_id]);
    if (rows != null) {
      console.log("ROW VALUE");
      console.log(rows); 
      const goalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = goalArray[0];
      console.log(currGoal); 
      console.log("In get goal ID, and curr goal has a value of: " + currGoal.goal_progress); 
      var [questions, qFields] = await mysql.connect.execute("SELECT * FROM questions WHERE goal_id = ?", [goal_id]);
      const questionsArray = questions.map(x => new Question.Question(x));
      currGoal.goal_questions = questionsArray;
      const [responses, rFields] = await mysql.connect.execute("SELECT * FROM responses WHERE goal_id = ? ORDER BY response_date, question_id", [goal_id]);
      const q_responseArray = responses.map(x => new QResponse.QResponse(x));
      var responses_array = [];
      if (q_responseArray.length != 0) {
        responses_array.push(new Response.Response());
        responses_array[0].answers_array.push(q_responseArray[0]);
        responses_array[0].date = q_responseArray[0].date;
        for (var i=1; i<q_responseArray.length; i++) {
            console.log(q_responseArray[i].date);
            console.log(responses_array[responses_array.length - 1].date);
            if (q_responseArray[i].date.getTime() != responses_array[responses_array.length - 1].date.getTime()) {
              responses_array.push(new Response.Response());
              responses_array[responses_array.length - 1].date = q_responseArray[i].date;
            }
            responses_array[responses_array.length - 1].answers_array.push(q_responseArray[i]);
        }
      }
      currGoal.goal_responses =responses_array;
      return currGoal;
    }
    return null;
  },

  addGoalCoach: async function(goalData, currCoach, clients) {
    console.log("CLIENT FORM" + goalData.clientForm.length);
    typeof clientForm;
    if (Array.isArray(goalData.clientForm)) {
      for (var x = 0; x < goalData.clientForm.length; x++) {
        console.log("goal data is array" + goalData.clientForm[x]);
        var fullName = goalData.clientForm[x].split(" ");
        var today = new Date();
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf() == fullName[0].valueOf() && clients[j].lname.valueOf() == fullName[1].valueOf()){


            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned) VALUES(?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, goalData.goalTitle, goalData.goalDescription, 0, goalData.frequency, today]);
            console.log("added goal");
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
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
          }
        }
      }
    } else {
        console.log("goal data is not array" + goalData.clientForm[i]);
        var fullName = goalData.clientForm.split(" ");
        var today = new Date();
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf() == fullName[0].valueOf() && clients[j].lname.valueOf() == fullName[1].valueOf()){

            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned) VALUES(?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, goalData.goalTitle, goalData.goalDescription, 0, goalData.frequency, today]);
            console.log("added goal");
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
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
          }
      }
    }
  },

  addPrevGoal: async function(goalData, goalTitle, currCoach, clients) {
    var today = new Date();
    const [rowsMatch, fieldsMatch] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ?", [goalTitle]);
    const currGoalArrayMatch = rowsMatch.map(x => new Goal.Goal(x));
    const currGoalMatch = currGoalArrayMatch[0];

    if (Array.isArray(goalData.clientForm)) {
      for (var x = 0; x < goalData.clientForm.length; x++) {
        var fullName = goalData.clientForm[x].split(" ");
        var today = new Date();
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf() == fullName[0].valueOf() && clients[j].lname.valueOf() == fullName[1].valueOf()){

            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned) VALUES(?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, currGoalMatch.title, currGoalMatch.description, 0, currGoalMatch.frequency, today]);
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [currGoalMatch.title, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
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
          }
        }
      }
    } else {
        var fullName = goalData.clientForm.split(" ");
        var today = new Date();
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf() == fullName[0].valueOf() && clients[j].lname.valueOf() == fullName[1].valueOf()){

            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned) VALUES(?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, currGoalMatch.title, currGoalMatch.description, 0, currGoalMatch.frequency, today]);
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [currGoalMatch, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
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
          }
      }
    }
  }

};
