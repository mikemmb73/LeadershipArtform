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

		var goals = [];
		this.goals = goals;

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

  get coachID() {
    return this.coach_id;
  }
  set coachID(value) {
    this.coach_id = value;
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


	addGoal(goal) {
		this.goals.push(goal);
	}
}

module.exports = {
  Executive
};
