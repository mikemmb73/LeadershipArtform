/*****
Language: javascript

This file describes the response class. The constructor includes all fields that
are also used in the responsestable.  All fields have a getter/setter function.

****/

class Response {
  constructor() {
    this.responses = [];
    this.r_date = null;
  }

  set answers_array(val) {
    this.responses = val;
  }
  get answers_array() {
    return this.responses;
  }

  set date(val) {
    this.r_date = val;
  }
  get date() {
    return this.r_date;
  }
}

module.exports = {
  Response
};
