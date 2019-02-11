class Goal {
 	constructor(name, deadline, description) {
		this.name = name;
		this.description = description;
		this.deadline = deadline; 
	}

	get name() {
		return this.name; 
	}

	get description() {
		return this.description; 
	}

	get deadline() {
		return this.deadline; 
	}

}