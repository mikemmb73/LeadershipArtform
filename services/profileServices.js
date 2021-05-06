/*****

notesServices.js allows express and node.js to interact with the database when the
user is on the profile page

****/

var mysql = require("./sqlconnect.js");
var Goal = require("../model/goal");

module.exports = {

  /**
  editCoachInfo:
  paramters- newInfo, currCoach, newImage
  purpose- Changes the coach's information if they request to edit it.
  **/
  editCoachInfo: async function(newInfo, currCoach, newImage){
    var newFName = newInfo.newFName;
    var newLName = newInfo.newLName;
    var newEmail = newInfo.newEmail;
    var newBio = newInfo.newBio;
    var newPhoto = newImage;
    var newFullName;

    if (newFName != currCoach.first_name && newFName != ''){
      const updateFName = newFName;
      currCoach.first_name = newFName;
      const coach = currCoach;
      var coachID = coach.coach_id;
      await mysql.connect.execute("UPDATE coaches SET fname = ? WHERE coach_id = ?", [updateFName, coachID]);
    }

    if (newLName != currCoach.last_name && newLName != ''){
      currCoach.last_name = newLName;
      const coach = currCoach;
      var coachID = coach.coach_id;
      await mysql.connect.execute("UPDATE coaches SET lname = ? WHERE coach_id = ?", [newLName, coachID]);
    }


    currCoach.full_name = currCoach.first_name + " " + currCoach.last_name;

    if (newEmail != currCoach.user_email && newEmail != ''){
      currCoach.user_email = newEmail;
      const coach = currCoach;
      var coachID = coach.coach_id;
      await mysql.connect.execute("UPDATE coaches SET email = ? WHERE coach_id = ?", [newEmail, coachID]);
    }


    if (newBio != currCoach.biography && newBio != ''){
      currCoach.biography = newBio;
      const coach = currCoach;
      var coachID = coach.coach_id;
      await mysql.connect.execute("UPDATE coaches SET bio = ? WHERE coach_id = ?", [newBio, coachID]);
    }


    if (newPhoto != currCoach.photograph && newPhoto != ''){
      currCoach.photograph = newPhoto;
      const coach = currCoach;
      var coachID = coach.coach_id;
      await mysql.connect.execute("UPDATE coaches SET photo = ? WHERE coach_id = ?", [newPhoto, coachID]);
    }

  },

  /**
  editExecutiveInfo:
  paramters- newInfo, currExec, imageLocation
  purpose- Changes the executive's information if they request to edit it.
  **/
  editExecutiveInfo: async function(newInfo, currExec, imageLocation){
    var newFName = newInfo.newFName;
    var newLName = newInfo.newLName;
    var newEmail = newInfo.newEmail;
    var newBio = newInfo.newBio;
    var newPhoto = imageLocation;
    var newFullName;

    if (newFName != currExec.first_name && newFName != ''){
      const updateFName = newFName;
      currExec.first_name = newFName;
      const exec = currExec;
      var execID = exec.execID;
      await mysql.connect.execute("UPDATE executives SET fname = ? WHERE executive_id = ?", [updateFName, execID]);
    }

    if (newLName != currExec.last_name && newLName != ''){
      currExec.last_name = newLName;
      const exec = currExec;
      var execID = exec.execID;
      await mysql.connect.execute("UPDATE executives SET lname = ? WHERE executive_id = ?", [newLName, execID]);
    }


    currExec.full_name = currExec.first_name + " " + currExec.last_name;

    if (newEmail != currExec.user_email && newEmail != ''){
      currExec.user_email = newEmail;
      const exec = currExec;
      var execID = exec.execID;
      await mysql.connect.execute("UPDATE executives SET email = ? WHERE executive_id = ?", [newEmail, execID]);
    }


    if (newBio != currExec.biography && newBio != ''){
      currExec.biography = newBio;
      const exec = currExec;
      var execID = exec.execID;
      await mysql.connect.execute("UPDATE executives SET bio = ? WHERE executive_id = ?", [newBio, execID]);
    }


    if (newPhoto != currExec.photograph && newPhoto != ''){
      currExec.photograph = newPhoto;
      const exec = currExec;
      var execID = exec.execID;
      await mysql.connect.execute("UPDATE executives SET photo = ? WHERE executive_id = ?", [newPhoto, execID]);
    }
  },

  /**
  getExecGoals:
  paramters- execID
  purpose- Returns the goals associated with the executive.
  **/
  getExecGoals: async function(execID){
    const [goalRows, goalFields] = await mysql.connect.execute("SELECT * FROM goals WHERE executive_id = ?", [execID]);
    const goalRowsArray = goalRows.map(x => new Goal.Goal(x));
    return goalRowsArray;
  },


  /**
  getExecCompletedGoals:
  paramters- execID
  purpose- Returns the goals associated with the executive that are completed (progress is 100%)
  **/
  getExecCompletedGoals: async function(execID){
    var progress = 100;
    const [goalRows, goalFields] = await mysql.connect.execute("SELECT * FROM goals WHERE executive_id = ? AND progress = ? ", [execID, progress]);
    const goalRowsArray = goalRows.map(x => new Goal.Goal(x));
    return goalRowsArray;
  }



};
