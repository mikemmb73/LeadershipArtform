/*****
Language: javascript

This file describes the notes class. The constructor includes all fields that
are also used in the notes table. All fields have getter and setter functions. 

****/

class Note {
 	constructor(object) {
		this.coach_id = object.coach_id;
    this.executive_id = object.executive_id;
    this.info = object.info;
    this.date = object.date;
	}

  get coachID() {
    return this.coach_id;
  }
  set coachID(value) {
    this.coach_id = value;
  }

  get execID() {
    return this.executive_id;
  }
  set execID(value) {
    this.executive_id = value;
  }

  get note_content(){
    return this.info;
  }

  set note_content(value){
    this.info = value;
  }

  get note_date(){
    return this.date;
  }
}

module.exports =  {
  Note
};
