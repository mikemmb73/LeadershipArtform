class ExecutiveCoach {
 	constructor(fname, lname, email, phoneNumber, password, bio, photo) {
		this.fname = fname;
		this.lname = lname;
		this.email = email,
		this.phoneNumber = phoneNumber;
		this.password = password;
		this.bio = bio;
		this.photo = photo; 

		var goals = [];
		this.goals = goals; 

		var executives = [];
		this.executives = executives; 

		//assign an ID to the executive coach
		//idea: have a global counter that increments by 1 every time a coach signs up

		var id = controller.getNextAvailableID(); 
		this.id = id; 

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

	get id() {
		return this.id; 
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
