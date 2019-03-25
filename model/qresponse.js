class QResponse {
  constructor(obj) {
    this.response_id = obj.response_id;
    this.question_id = obj.question_id;
    this.goal_id = obj.goal_id;
    this.response_date = obj.response_date;
    this.answer = obj.answer;
  }

  set id(val) {
    this.response_id = val;
  }
  get id() {
    return this.response_id;
  }

  set response_question_id(val) {
    this.question_id = val;
  }
  get response_question_id() {
    return this.question_id;
  }

  set response_goal_id(val) {
    this.goal_id = val;
  }
  get response_goal_id() {
    return this.goal_id;
  }

  set date(val) {
    this.response_date = val;
  }
  get date() {
    return this.response_date;
  }

  set response_answer(val) {
    this.answer = val;
  }
  get response_answer() {
    return this.answer;
  }
}

module.exports =  {
  QResponse
};
