/*****

notesServices.js allows express and node.js to interact with the database when the 
coach decides to add a note for the executive. 

****/ 

var mysql = require("./sqlconnect.js");
var Executive = require("../model/executive");
var Note = require("../model/note");

module.exports = {

    /**
    addNote:
    paramters- execID, coachID, note
    purpose- Adds to the note database if the coach decides to add a note for a specific executive. 
    **/
  addNote: async function(execID, coachID, note) {
    var today = new Date();
    const [execRows, execFields] = await mysql.connect.execute("SELECT * FROM executives WHERE executive_id = ?", [execID]);
    const execRowsArray = execRows.map(x => new Executive.Executive(x));
    const exec = execRowsArray[0];

    const [noteRows, noteFields] = await mysql.connect.execute("SELECT * FROM notes WHERE executive_id = ? AND coach_id = ? AND info = ?", [execID, coachID, note]);
    if (noteRows.length){
      return;
    }
    await mysql.connect.execute("INSERT INTO notes(executive_id, coach_id, info, date) VALUES(?, ?, ?, ?);", [execID, coachID, note, today]);

    console.log("noteRows is: " + noteRows);
    const currNoteArray = noteRows.map(x => new Note.Note(x));
    const currNote = currNoteArray[0];
    exec.addNote(currNote);
  },

    /**
    viewNotes
    paramters- execID, coachID
    purpose- Returns the coach's notes for a specified executive. 
    **/
  viewNotes: async function(execID, coachID) {
    console.log("in viewNotes");
    const [execRows, execFields] = await mysql.connect.execute("SELECT * FROM executives WHERE executive_id = ?", [execID]);
    const execRowsArray = execRows.map(x => new Executive.Executive(x));
    const exec = execRowsArray[0];

    const [noteRows, noteFields] = await mysql.connect.execute("SELECT * FROM notes WHERE executive_id = ? AND coach_id = ?", [execID, coachID]);
    const currNoteArray = noteRows.map(x => new Note.Note(x));

    exec.notes_list = currNoteArray;
    return currNoteArray;
  }
};
