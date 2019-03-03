function mcDropdown(){
  document.getElementById('mcButton').disabled=true;
  document.getElementById('freeResponseButton').disabled=true;
  document.getElementById('likertButton').disabled=true;
  var jumbotron = document.getElementById('questionDropdown');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }
  var form = document.createElement("form");
  var formAttClass = document.createAttribute("class");
  formAttClass.value="form-control form-group";
  var selectForm = document.createElement("select");
  var selectFormID = document.createAttribute("id");
  selectFormID.value="optionsNumber";
  selectForm.setAttributeNode(selectFormID);
  form.appendChild(selectForm);
  jumbotron.appendChild(form);

  var i;
  var options;
  for (i = 1; i < 6; i++){
    options = document.createElement("option");
    //set option value
    var optionsAmount = document.createTextNode(i);
    options.appendChild(optionsAmount);
    var optionsValue = document.createAttribute("value");
    optionsValue.value = i;
    options.setAttributeNode(optionsValue);
    selectForm.appendChild(options);
  }

  var getSelections = document.getElementById('optionsNumber');
  var selection = getSelections.options[getSelections.selectedIndex].value;
  console.log(selection);



}

function freeResponseDropdown(){
  document.getElementById('mcButton').disabled=true;
  document.getElementById('freeResponseButton').disabled=true;
  document.getElementById('likertButton').disabled=true;
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
  document.getElementById('mcButton').disabled=true;
  document.getElementById('freeResponseButton').disabled=true;
  document.getElementById('likertButton').disabled=true;
  console.log('here likert');
  var jumbotron = document.getElementById('questionDropdown');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }
}
