class ExecutiveCoach {

  // constructor(obj) {
  //   this.fname = obj.fname;
  //   this.lname = obj.lname;
  //   this.email = obj.email;
  //   this.phone_number = obj.phone_number;
  //   this.password = obj.password;
  //   this.bio = obj.bio;
  //   this.photo = obj.photo;
  //   this.coach_id = obj.coach_id;
  //
  //   var goals = [];
  //   this.goals = goals;
  //
  //   var executives = [];
  //   this.executives = executives;
  // }
  //
 	constructor(fname, lname, email, phone_number, password, bio, photo, coach_id) {
		this.fname = fname;
		this.lname = lname;
		this.email = email;
		this.phone_number = phone_number;
		this.password = password;
		this.bio = bio;
		this.photo = photo;
    this.coach_id = coach_id;

		var goals = [];
		this.goals = goals;

		var executives = [];
		this.executives = executives;

		//assign an ID to the executive coach
		//idea: have a global counter that increments by 1 every time a coach signs up

		// var id = controller.getNextAvailableID();
		// this.id = id;

	}
  set phoneNumber(phone_number) {
    this.phone_number = phone_number;
  }
  set lname(lname) {
		this.lname = lname;
	}
  set fname(fname) {
    this.fname = fname;
  }

	get email() {
		return this.email;
	}
  set email(email) {
    this.email = email;
  }

	get phoneNumber() {
		return this.phone_number;
	}

	get password() {
		return this.password;
	}
  set password(password) {
    this.password = password;
  }

	get bio() {
		return this.bio;
	}
  set bio(bio) {
    this.bio = bio;
  }

	get photo() {
		return this.photo;
	}

  set photo(photo) {
    this.photo = photo;
  }

	get goals() {
		return this.goals;
	}

	get coach_id() {
		return this.coach_id;
	}
  set coach_id(coach_id) {
    this.coach_id = coach_id;
  }

	get executives() {
		return this.executives;
	}

	addGoal(goal) {
		this.goals.push(goal);
	}

	addExecutive(executive) {
		//this function needs to be called when an executive signs up
		this.executives.push(executive);
	}
}
module.exports = {
  ExecutiveCoach
};
