/*****
Language: javascript

This file describes the questions class. The constructor includes all fields that
are also used in the questions table. Answers is an array that is populated
when an executive adds a response to the specific goal. All
fields have a getter/setter function. The array has an add functions that pushes the
value to their array. 

****/

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
