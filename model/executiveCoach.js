class ExecutiveCoach {

  constructor(obj) {
    this.fname = obj.fname;
    this.lname = obj.lname;
    this.email = obj.email;
    this.phone_number = obj.phone_number;
    this.password = obj.password;
    this.bio = obj.bio;
    this.photo = obj.photo;
    this.coach_id = obj.coach_id;

    var goals = [];
    this.goals = goals;

    var executives = [];
    this.executives = executives;
  }

//  	constructor(first_name, last_name, user_email, phone, pass, description, picture, id_coach) {
//     this.fname = first_name;
// 		this.lname = last_name;
// 		this.email = user_email;
// 		this.phone_number = phone;
// 		this.password = pass;
// 		this.bio = description;
// 		this.photo = picture;
//     this.coach_id = id_coach;
//
// 		var _goals = [];
// 		this.goals = _goals;
//
// 		var _executives = [];
// 		this.executives = _executives;
// }
		//assign an ID to the executive coach
		//idea: have a global counter that increments by 1 every time a coach signs up

		// var id = controller.getNextAvailableID();
		// this.id = id;

  set phone_num(_phone_number) {
    this.phone_number = _phone_number;
  }
  set last_name(value) {
		this.lname = value;
	}
  set first_name(value) {
    this.fname = value;
  }

  get full_name() {
    return this.fname + " " + this.lname
  }
  get first_name() {
    return this.fname
  }

	get user_email() {
		return this.email;
	}
  set user_email(value) {
    this.email = value;
  }

	get phone_num() {
		return this.phone_number;
	}

	get pass() {
		return this.password;
	}
  set pass(value) {
    this.password = value;
  }

	get biography() {
		return this.bio;
	}
  set biography(value) {
    this.bio = _value;
  }

	get photograph() {
		return this.photo;
	}

  set photograph(value) {
    this.photo = value;
  }

	get coach_goals() {
		return this.goals;
	}

  set coach_goals(value) {
    this.goals = value
  }

	get coach_id_val() {
		return this.coach_id;
	}
  set coach_id_val(value) {
    this.coach_id = value;
  }

	get executive() {
		return this.executives;
	}
  set executive(value) {
    this.executives = value
  }

	addGoal(_goal) {
		this.goals.push(_goal);
	}

	addExecutive(executive) {
		//this function needs to be called when an executive signs up
		this.executives.push(executive);
	}
}
module.exports =  {
  ExecutiveCoach
};
