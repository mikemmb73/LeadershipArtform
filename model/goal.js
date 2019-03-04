class Goal {
 	constructor(goal_id, coach_id, executive_id, title, description, progress,
  frequency, date_assigned) {
		this.goal_id = goal_id;
		this.coach_id = coach_id;
		this.executive_id = executive_id;
    this.title = title;
    this.description = description;
    this.progress = progress;
    this.frequency = frequency;
    this.date_assigned = date_assigned;
	}

	get goal_id() {
		return this.goal_id;
	}

  get coach_id() {
    return this.coach_id;
  }

  get executive_id() {
    return this.executive_id;
  }

  get title() {
    return this.title;
  }

	get description() {
		return this.description;
	}

  get progress(){
    return this.progress;
  }

  get frequency(){
    return this.frequency;
  }

	get date_assigned() {
		return this.date_assigned;
	}



}
