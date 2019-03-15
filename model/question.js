class Question {
  constructor(obj) {
    this.title = obj.title;
    this.type = obj.type;
    this.answer = obj.answer;
    this.qs = obj.qs;
    this.goal_id = obj.goal_id;

  }

  get question_title() {
    return this.title;
  }
  set question_title(val) {
    this.title = val;
  }

  get question_type() {
    return this.type;
  }
  set question_type(val) {
    this.type = val;
  }

  get question_answer() {
    return this.answer;
  }

  set question_answer(val) {
    this.answer = val;
  }

  set question_qs(val) {
    this.qs = val;
  }
  get question_qs() {
    return this.qs;
  }
  get question_goal_id(){
    return this.coach_id;
  }
  set question_goal_id(val) {
    this.coach_id = val;
  }


}

module.exports =  {
  Question
};
