/*****
Language: javascript

This file describes the executive class. The constructor includes all fields that
are also used in the executives table. Goals and notes are arrays that are populated
when a coach/executive adds a goal and/or note to this particular executive. All
fields have a getter/setter function. The arrays have add functions that push the
value to their array. 

****/

class Executive {
 	constructor(object) {
		this.fname = object.fname;
		this.lname = object.lname;
		this.email = object.email,
		this.phone_number = object.phone_number;
		this.password = object.password;
		this.coach_id = object.coach_id;
		this.bio = object.bio;
		this.photo = object.photo;
    this.executive_id = object.executive_id;
    this.message = object.message;

		var goals = [];
		this.goals = goals;

    var notes = [];
    this.notes = notes;

		// var executive = getExecutive(coachID);
		// this.executive = executive;


	}

  get exec_goals() {
    return this.goals;
  }
  set exec_goals(val) {
    this.goals = val;
  }

	get name() {
		return this.fname + " " + this.lname;
	}

  get first_name(){
    return this.fname;
  }

  get last_name(){
    return this.lname;
  }
  
  set first_name(value) {
    this.fname = value;
  }
  set last_name(value) {
    this.lname = value;
  }

	get username() {
		return this.email;
	}
  set username(value) {
    this.email = value;
  }

	get phoneNumber() {
		return this.phone_number;
	}
  set phoneNumber(value) {
    this.phone_number = value;
  }

	get pass() {
		return this.password;
	}
  set pass(value) {
    this.password = value;
  }

	get bio_info() {
		return this.bio;
	}
  set bio_info(value) {
    this.bio = value;
  }

	get photograph() {
		return this.photo;
	}
  set photograph(value) {
    this.photo = value;
  }

	get goals_list() {
		return this.goals;
	}
  set goals_list(value) {
    this.goals = value;
  }

  get notes_list(){
    return this.notes;
  }

  get coachID() {
    return this.coach_id;
  }
  set coachID(value) {
    this.coach_id = value;
  }

  get execID(){
    return this.executive_id;
  }
	// getExecutive(coachID) {
	// 	//we should loop through all of the available coach's and see which ID matches
	// 	// var allExecutives = controller.getExecutives();
	// 	var length = allExecutiveCoaches.length;
	// 	for (var i = 0; i < length; i++) {
	// 		if (allExecutiveCoaches[i].id() == coachID) {
	// 			return allExecutiveCoaches[i];
	// 		}
	// 	}
	// }

  set coach_message(value) {
    this.message = value;
  }
  get coach_message() {
    return this.message;
  }

	addGoal(goal) {
		this.goals.push(goal);
	}

  addNote(note) {
    this.notes.push(note);
    console.log("ADDING NOTE");
    console.log("notes size is now " + this.notes.length);
  }
}

module.exports = {
  Executive
};
