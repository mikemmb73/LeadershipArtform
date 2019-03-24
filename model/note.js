class Note {
 	constructor(object) {
		this.coach_id = object.coach_id;
    this.executive_id = object.executive_id;
    this.note = object.note;
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
    return this.note;
  }

  set note_content(value){
    this.note = value;
  }
}
