/*****

addGoalServices.js allows express and node.js to interact with the database when the
executive or coach decides to add a goal.

****/

var mysql = require("./sqlconnect.js");
var Goal = require("../model/goal");
var Question = require("../model/question");
var QResponse = require("../model/qresponse");
var Response = require("../model/response");

// MC =0, FR = 1, L = 2
module.exports = {

  /**
  addGoalExecutive:
  paramters- the goal information and the current executive logged on
  purpose- insert the goal information into the database.
  notes- coach_id will entered as -1, since the executive entered this goal
  **/
  addGoalExecutive: async function(goalData, currExecutive) {
    // print(goalData)
    var today = new Date();
    var nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // console.log("This is my goal data" + goalData.goalTitle);
    // console.log("This is my goal data" + goalData.goalTitle);
    const [rowsTest, fieldsTest] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    if (rowsTest.length) {
      return;
    }

    await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned, currDueDate, progress_acceptance) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [-1,currExecutive.executive_id, goalData.goalTitle, goalData.goalDescription, 0, goalData.frequency, today, nextWeek, 0]);

    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    // console.log(rows);
    const currGoalArray = rows.map(x => new Goal.Goal(x));
    const currGoal = currGoalArray[0];
    currGoal.goal_due_date = nextWeek;

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
    currGoal.goal_questions = currQuestionArray;
    currExecutive.addGoal(currGoal);
  },


  /**
  viewGoalExecutive:
  paramters- the goal information and the current executive logged on
  purpose- view the goal information and the questions within the goal
  **/
  viewGoalExecutive: async function(goalData, currExecutive) {
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, currExecutive.executive_id]);
    if (rows != null){
      const currGoalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      var getStatement = "SELECT * FROM questions WHERE goal_id = IFNULL(" + currGoal.id + ", goal_id)";
      const [questionRows, questionFields] = await mysql.connect.execute(getStatement);
      const currQuestionArray = questionRows.map(x => new Question.Question(x));
      currGoal.goal_questions = currQuestionArray;
      console.log("inside addgoalServices: currGoal.goal_questions is: " + currGoal.goal_questions);
      return currGoal;
    }

    else{
      return null;
    }
  },

  /**
  acceptProgressUpdate:
  paramters- goalID
  purpose- Called when a coach has accepts the executive's request to update their pgoress.
  **/
  acceptProgressUpdate: async function(goalID) {
    var progressValue;
    const [rows1, fields1] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    if (rows1 != null) {
      const currGoalArray = rows1.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      progressValue = currGoal.progress_update;
    }

    var statement = "UPDATE goals SET progress= " + progressValue + " WHERE goal_id = " + goalID;
    await mysql.connect.execute(statement);
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    if (rows != null) {
      const currGoalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      currGoal.goal_progress = progressValue;
    }
  },

  /**
  updateProgressCoach:
  paramters- goalID, progressValue
  purpose- Called when an executive wishes to update the progress of their goal.
  notes- this only updates the progress_acceptance field. The progress is not reflected
  until the coach explicitly approves the request.
  **/
  updateProgressCoach: async function(goalID, progressValue) {
    // console.log("updateProgress" + goalID + " " + progressValue);
    var statement = "UPDATE goals SET progress = " + progressValue + " WHERE goal_id = " + goalID;
    await mysql.connect.execute(statement);
    var statement2 = "UPDATE goals SET progress_acceptance = " + progressValue + " WHERE goal_id = " + goalID;
    await mysql.connect.execute(statement2);
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    if (rows != null) {
      const currGoalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      currGoal.goal_progress = progressValue;
      currGoal.progress_update = progressValue;
    }

  },

  /**
  updateProgress:
  paramters- goalID, progressValue
  purpose- Called when a coach wishes to update the progress of the executive's goal.
  notes- this updates the executive's progrss field immediately and should be reflected
  in the progress bar
  **/
  updateProgress: async function(goalID, progressValue) {     //when exec requests to change progress
    console.log("updateProgress" + goalID + " " + progressValue);
    var statement = "UPDATE goals SET progress_acceptance = " + progressValue + " WHERE goal_id = " + goalID;
    await mysql.connect.execute(statement);
    const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE goal_id = ?", [goalID]);
    if (rows != null) {
      const currGoalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = currGoalArray[0];
      currGoal.progress_update = progressValue;
    }
  },

  /**
  getGoalWithId:
  paramters- goal_id
  purpose- returns the goal given it's id. Includes the questions in the goal and any responses that have been logged
  **/
  getGoalWithId: async function(goal_id) {
    const [rows, fields] = await mysql.connect.execute("SELECT * from goals WHERE goal_id = ?", [goal_id]);
    if (rows != null) {
      const goalArray = rows.map(x => new Goal.Goal(x));
      const currGoal = goalArray[0];
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

  /**
  addGoalCoach:
  paramters- goalData, currCoach, clients
  purpose- Called when a coach wishes to add a goal to a client or client(s). If clients, the
  client form will be of an array type, and will enter the first if statement. If only one client,
  the client form will be a string and will not need to loop through the entire clientForm
  **/
  addGoalCoach: async function(goalData, currCoach, clients) {
    console.log(goalData)
    console.log(clients)
    
    console.log("CLIENT FORM" + goalData.clientForm.length);
    typeof clientForm;
    if (Array.isArray(goalData.clientForm)) {
      for (var x = 0; x < goalData.clientForm.length; x++) {
        console.log("goal data is array" + goalData.clientForm[x]);
        var fullName = goalData.clientForm[x].split(" ");
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf().trim() == fullName[0].valueOf().trim() && clients[j].lname.valueOf().trim() == fullName[1].valueOf().trim()){


            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned, currDueDate, progress_acceptance) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, goalData.goalTitle, goalData.goalDescription, 0, goalData.frequency, today, nextWeek, 0]);
            console.log("added goal");
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
            currGoal.goal_due_date = nextWeek;
            if (goalData.mcQuestions != null) {
              for (var i=0; i<goalData.mcQuestions.length; i++) {
                var choices = "";
                for (var j=1; j<goalData.mcQuestions[0].length; j++) {
                  choices += goalData.mcQuestions[0][j] + ",";
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
          }
        }
      }
    } else {
        console.log("printing goal data");
        console.log(goalData);
        console.log("goal data is not array" + goalData.clientForm[i]);
        var fullName = goalData.clientForm.split(" ");
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        for (var j = 0; j < clients.length; j++) {
          console.log("+" + clients[j].fname.valueOf() + "+");
          console.log("+" + fullName[0].valueOf() + "+");
          console.log("+" + clients[j].lname.valueOf() + "+");
          console.log("+" + fullName[1].valueOf() + "+");
          if (clients[j].fname.valueOf().trim() == fullName[0].valueOf().trim() && clients[j].lname.valueOf().trim() == fullName[1].valueOf().trim()){
            console.log("IN THE LOOP TO ADD QUESTION");
            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned, currDueDate, progress_acceptance) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, goalData.goalTitle, goalData.goalDescription, 0, goalData.frequency, today, nextWeek, 0]);
            console.log("added goal");
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [goalData.goalTitle, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
            currGoal.goal_due_date = nextWeek;
            if (goalData.mcQuestions != null) {
              for (var i=0; i<goalData.mcQuestions.length; i++) {
                var choices = "";
                for (var j=1; j<goalData.mcQuestions[0].length; j++) {
                  choices += goalData.mcQuestions[0][j] + ",";
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
          }
      }
    }
  },

  /**
  addPrevGoal:
  paramters- goalData, goalTitle, currCoach, clients
  purpose- Called when a coach wishes to reuse a goal they have previously assigned. They are able
  to select one or multiple clients to assign the goal to.
  notes- If goalData.clientForm is an array, the coach has selected mutliple clients and will loop through
  each in order to add to the database. If it is a string, the coach will only add to that one specific executive.
  **/
  addPrevGoal: async function(goalData, goalTitle, currCoach, clients) {
    var today = new Date();
    var nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const [rowsMatch, fieldsMatch] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ?", [goalTitle]);
    const currGoalArrayMatch = rowsMatch.map(x => new Goal.Goal(x));
    const currGoalMatch = currGoalArrayMatch[0];

    if (Array.isArray(goalData.clientForm)) {
      for (var x = 0; x < goalData.clientForm.length; x++) {
        var fullName = goalData.clientForm[x].split(" ");
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf().trim() == fullName[0].valueOf().trim() && clients[j].lname.valueOf().trim() == fullName[1].valueOf().trim()){

            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned, currDueDate, progress_acceptance) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, currGoalMatch.title, currGoalMatch.description, 0, currGoalMatch.frequency, today, nextWeek, 0]);
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [currGoalMatch.title, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
            currGoal.goal_due_date = nextWeek;
            if (goalData.mcQuestions != null) {
              for (var i=0; i<goalData.mcQuestions.length; i++) {
                var choices = "";
                for (var j=1; j<goalData.mcQuestions[0].length; j++) {
                  choices += goalData.mcQuestions[0][j] + ",";
                }
                await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.mcQuestions[i][0], 0, choices]);
              }
            }
            if (goalData.frQuestions != null) {
              for (var i=0; i<goalData.frQuestions.length; i++) {
                await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.frQuestions[i], 1,""]);
              }
            }
            if (goalData.likertQuestions != null) {
              for (var i=0; i<goalData.likertQuestions.length; i++) {
                var choices = goalData.likertQuestions[i][1] + "," + goalData.likertQuestions[i][2];
                await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.likertQuestions[i][0], 2, choices]);
              }
            }
          }
        }
      }
    } else {
        console.log(goalData);
        console.log(currGoalMatch);
        var fullName = goalData.clientForm.split(" ");
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        for (var j = 0; j < clients.length; j++) {
          if (clients[j].fname.valueOf().trim() == fullName[0].valueOf().trim() && clients[j].lname.valueOf().trim() == fullName[1].valueOf().trim()){
            await mysql.connect.execute("INSERT INTO goals(coach_id, executive_id, title, description, progress, frequency, date_assigned, currDueDate, progress_acceptance) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);", [currCoach.coach_id, clients[j].executive_id, currGoalMatch.title, currGoalMatch.description, 0, currGoalMatch.frequency, today, nextWeek, 0]);
            const [rows, fields] = await mysql.connect.execute("SELECT * FROM goals WHERE title = ? AND executive_id = ?", [currGoalMatch.goal_title, clients[j].executive_id]);
            const currGoalArray = rows.map(x => new Goal.Goal(x));
            const currGoal = currGoalArray[0];
            currGoal.goal_due_date = nextWeek;

            if (goalData.mcQuestions != null) {
              for (var i=0; i<goalData.mcQuestions.length; i++) {
                var choices = "";
                for (var j=1; j<goalData.mcQuestions[0].length; j++) {
                  choices += goalData.mcQuestions[0][j] + ",";
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
                await mysql.connect.execute("INSERT INTO questions(goal_id, title, type, qs) VALUES(?, ?, ?, ?);", [currGoal.id ,goalData.likertQuestions[i][0], 2,choices]);
              }
            }
          }
      }
    }
  }

};
