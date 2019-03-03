function mcDropdown(){
  var jumbotron = document.getElementById('questionDropdown');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }
  var form = document.createElement("form");
  // var formAttClass = document.createAttribute("class");
  // formAttClass.value="form-control";
  var selectForm = document.createElement("select");
  form.appendChild(selectForm);

  var i;
  var options;
  for (i = 0; i < 7; i++){
    console.log("inside for loop");
    options = document.createElement("option");
    var optionsAmount = document.createTextNode(i);
    options.appendChild(optionsAmount);
    selectForm.appendChild(options);
  }

  var radio = document.createElement("input");
  var radioAtt = document.createAttribute("type");
  radioAtt.value="radio";
  radio.setAttributeNode(radioAtt);
  jumbotron.appendChild(radio);

}

function freeResponseDropdown(){
  var jumbotron = document.getElementById('questionDropdown');

  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }
  //Question Title
  var questionTitleLabel_ = document.createElement("label");
  var questionTitleLabel = document.createTextNode("Question Title");
  questionTitleLabel_.appendChild(questionTitleLabel);
  jumbotron.appendChild(questionTitleLabel);
  //Area for coach to type in Question Title
  var inputTitle = document.createElement("input");
  var inputType = document.createAttribute("type");
  inputType.value="textarea";
  inputTitle.setAttributeNode(inputType);
  jumbotron.appendChild(inputTitle);

  //break
  var br = document.createElement("br");
  jumbotron.appendChild(br);
  //Question
  var questionLabel_ = document.createElement("label");
  var questionLabel = document.createTextNode("Question");
  questionLabel_.appendChild(questionLabel);
  jumbotron.appendChild(questionLabel);
  //Area for coach to type in Question
  var inputQuestion = document.createElement("input");
  var inputQuestionType = document.createAttribute("type");
  var inputQuestionID = document.createAttribute("id");
  inputQuestionID.value="freeResponseQuestion";
  inputQuestion.setAttributeNode(inputQuestionType);
  inputQuestion.setAttributeNode(inputQuestionID);
  jumbotron.appendChild(inputQuestion);

  var br2 = document.createElement("br");
  jumbotron.appendChild(br2);

  //Save button
  var saveButton = document.createElement("button");
  var buttonText = document.createTextNode("Save");
  saveButton.appendChild(buttonText);
  var saveButtonClass = document.createAttribute("class");
  saveButtonClass.value="btn-primary";
  saveButton.setAttributeNode(saveButtonClass);
  jumbotron.appendChild(saveButton);
}

function likertDropdown(){
  console.log('here likert');
  var jumbotron = document.getElementById('questionDropdown');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }
}
