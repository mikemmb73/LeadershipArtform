class Question {
  constructor(obj) {
    this.title = obj.title;
    this.question_id = obj.question_id;
    this.type = obj.type;
    this.qs = obj.qs;
    this.goal_id = obj.goal_id;

    this.answers = []
    this.answers = this.qs.split(',');
  }

  get answer_array() {
    return this.answers;
  }
  // 
  set answer_array(val) {
    this.answers.push(val);
  }

  get question_title() {
    return this.title;
  }
  set question_title(val) {
    this.title = val;
  }

  get question_id(){
    return this.id;
  }

  set question_id(val){
    this.id = val;
  }

  get question_type() {
    return this.type;
  }
  set question_type(val) {
    this.type = val;
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
