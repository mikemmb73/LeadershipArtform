class Executive {
 	constructor(fname, lname, email, phoneNumber, coachID, password, bio, photo) {
		this.fname = fname;
		this.lname = lname;
		this.email = email,
		this.phoneNumber = phoneNumber;
		this.password = password;
		this.coachID = coachID; 
		this.bio = bio;
		this.photo = photo; 

		var goals = [];
		this.goals = goals; 

		var executive = getExecutive(coachID); 
		this.executive = executive; 

		//assign an ID to the executive coach
		//idea: have a global counter that increments by 1 every time a coach signs up
		//where should our counter be?

		//var id = getNextAvailableID(); 
		//this.id = id; 

	}

	get name() {
		return this.fname + " " + this.lname; 
	}

	get username() {
		return this.email; 
	}

	get phoneNumber() {
		return this.phoneNumber; 
	}

	get password() {
		return this.password; 
	}

	get bio() {
		return this.bio; 
	}

	get photo() {
		return this.photo; 
	}

	get goals() {
		return this.goals;
	}

	getExecutive(coachID) {
		//we should loop through all of the available coach's and see which ID matches
		// var allExecutives = controller.getExecutives(); 
		var length = allExecutiveCoaches.length;
		for (var i = 0; i < length; i++) {
			if (allExecutiveCoaches[i].id() == coachID) {
				return allExecutiveCoaches[i]; 
			}
		}
	}


	addGoal(goal) {
		this.goals.push(goal); 
	}
}
