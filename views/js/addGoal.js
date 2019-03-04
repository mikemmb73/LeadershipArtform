function mcDropdown(){
  document.getElementById('mcButton').disabled=true;
  document.getElementById('freeResponseButton').disabled=true;
  document.getElementById('likertButton').disabled=true;

  var jumbotron = document.getElementById('questionDropdown');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }

  //Close Button
  var closeButton = document.createElement("button");
  var closeButtonType= document.createAttribute("type");
  closeButtonType.value="button";
  closeButton.setAttributeNode(closeButtonType);
  closeButton.style.float="right";
  var closeButtonClass= document.createAttribute("class");
  closeButtonClass.value=" btn btn-danger";
  closeButton.setAttributeNode(closeButtonClass);
  var closeButtonText = document.createTextNode("X");
  closeButton.appendChild(closeButtonText);
  jumbotron.appendChild(closeButton);
  closeButton.onclick = function(){
    jumbotron.style.display = "none";
    document.getElementById('mcButton').disabled=false;
    document.getElementById('freeResponseButton').disabled=false;
    document.getElementById('likertButton').disabled=false;

    while (jumbotron.firstChild) {
      jumbotron.removeChild(jumbotron.firstChild);
    }
  };

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

  var br2 = document.createElement("br");
  jumbotron.appendChild(br2);

  //Multiple Choice Options
  //Option1 Title
  var option1TitleLabel_ = document.createElement("label");
  var option1TitleLabel = document.createTextNode("Option 1 Value: ");
  questionTitleLabel_.appendChild(option1TitleLabel);
  jumbotron.appendChild(option1TitleLabel);
  //Area for coach to type in Question Title
  var option1Title = document.createElement("input");
  var option1Type = document.createAttribute("type");
  option1Type.value="textarea";
  option1Title.setAttributeNode(option1Type);
  jumbotron.appendChild(option1Title);
  var br2 = document.createElement("br");
  jumbotron.appendChild(br2);
  //Option2 Title
  var option2TitleLabel_ = document.createElement("label");
  var option2TitleLabel = document.createTextNode("Option 2 Value: ");
  questionTitleLabel_.appendChild(option2TitleLabel);
  jumbotron.appendChild(option2TitleLabel);
  //Area for coach to type in Question Title
  var option2Title = document.createElement("input");
  var option2Type = document.createAttribute("type");
  option2Type.value="textarea";
  option2Title.setAttributeNode(option2Type);
  jumbotron.appendChild(option2Title);

  //Add Option button
  var addOptionButton = document.createElement("button");
  var buttonText = document.createTextNode("Add Option");
  addOptionButton.appendChild(buttonText);
  var addOptionButtonClass = document.createAttribute("class");
  addOptionButtonClass.value="btn-primary";
  addOptionButton.setAttributeNode(addOptionButtonClass);
  jumbotron.appendChild(addOptionButton);  


  //Save button
  var saveButton = document.createElement("button");
  var buttonText = document.createTextNode("Save");
  saveButton.appendChild(buttonText);
  var saveButtonClass = document.createAttribute("class");
  saveButtonClass.value="btn-primary";
  saveButton.setAttributeNode(saveButtonClass);
  jumbotron.appendChild(saveButton);
  var br2 = document.createElement("br");
  jumbotron.appendChild(br2);


  var num = 3;

  addOptionButton.onclick = function() {
    var option3TitleLabel_ = document.createElement("label");
    var numVal = "Option " + num + " Value: ";
    var option3TitleLabel = document.createTextNode(numVal);
    questionTitleLabel_.appendChild(option3TitleLabel);
    jumbotron.appendChild(option3TitleLabel);
    //Area for coach to type in Question Title
    var option3Title = document.createElement("input");
    var option3Type = document.createAttribute("type");
    option3Type.value="textarea";
    option3Title.setAttributeNode(option3Type);
    jumbotron.appendChild(option3Title);
    var br2 = document.createElement("br");
    jumbotron.appendChild(br2);
    num++;
  };

}

function freeResponseDropdown(){
  document.getElementById('mcButton').disabled=true;
  document.getElementById('freeResponseButton').disabled=true;
  document.getElementById('likertButton').disabled=true;
  var jumbotron = document.getElementById('questionDropdown');

  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }

  //Close Button
  var closeButton = document.createElement("button");
  var closeButtonType= document.createAttribute("type");
  closeButtonType.value="button";
  closeButton.setAttributeNode(closeButtonType);
  closeButton.style.float="right";
  var closeButtonClass= document.createAttribute("class");
  closeButtonClass.value=" btn btn-danger";
  closeButton.setAttributeNode(closeButtonClass);
  var closeButtonText = document.createTextNode("X");
  closeButton.appendChild(closeButtonText);
  jumbotron.appendChild(closeButton);
  closeButton.onclick = function(){
    jumbotron.style.display = "none";
    document.getElementById('mcButton').disabled=false;
    document.getElementById('freeResponseButton').disabled=false;
    document.getElementById('likertButton').disabled=false;
    while (jumbotron.firstChild) {
      jumbotron.removeChild(jumbotron.firstChild);
    }
  };


  //Question Label
  var questionTitleLabel_ = document.createElement("label");
  var questionTitleLabel = document.createTextNode("Question");
  questionTitleLabel_.appendChild(questionTitleLabel);
  jumbotron.appendChild(questionTitleLabel);

  //Area for coach to type in Question
  var inputTitle = document.createElement("input");
  var inputType = document.createAttribute("type");
  inputType.value="textarea";
  inputTitle.setAttributeNode(inputType);
  var inputTitleID = document.createAttribute("id");
  inputTitleID.value="freeResponseQuestion";
  inputTitle.setAttributeNode(inputTitleID);
  jumbotron.appendChild(inputTitle);

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
  var jumbotron = document.getElementById('questionDropdown');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }

  //Close Button
  var closeButton = document.createElement("button");
  var closeButtonType= document.createAttribute("type");
  closeButtonType.value="button";
  closeButton.setAttributeNode(closeButtonType);
  closeButton.style.float="right";
  var closeButtonClass= document.createAttribute("class");
  closeButtonClass.value=" btn btn-danger";
  closeButton.setAttributeNode(closeButtonClass);
  var closeButtonText = document.createTextNode("X");
  closeButton.appendChild(closeButtonText);
  jumbotron.appendChild(closeButton);
  closeButton.onclick = function(){
    jumbotron.style.display = "none";
    document.getElementById('mcButton').disabled=false;
    document.getElementById('freeResponseButton').disabled=false;
    document.getElementById('likertButton').disabled=false;
    while (jumbotron.firstChild) {
      jumbotron.removeChild(jumbotron.firstChild);
    }
  };

  var questionTitleLabel_ = document.createElement("label");
  var questionTitleLabel = document.createTextNode("Scaled question (1-5)");
  questionTitleLabel_.appendChild(questionTitleLabel);
  jumbotron.appendChild(questionTitleLabel);

  var inputQuestion = document.createElement("input");
  var inputQuestionType = document.createAttribute("type");
  var inputQuestionID = document.createAttribute("id");
  inputQuestionID.value="likertQuestion";
  inputQuestion.setAttributeNode(inputQuestionType);
  inputQuestion.setAttributeNode(inputQuestionID);
  jumbotron.appendChild(inputQuestion);

  var br = document.createElement("br");
  jumbotron.appendChild(br);

  var leftSideLabel_ = document.createElement("label");
  var leftSideLabel = document.createTextNode("1 = ");
  leftSideLabel_.appendChild(leftSideLabel);
  jumbotron.appendChild(leftSideLabel);

  var leftSideInput = document.createElement("input");
  var leftSideInputType = document.createAttribute("type");
  var lSideID = document.createAttribute("id");
  lSideID.value="likertScaleLeftRight";
  leftSideInput.setAttributeNode(leftSideInputType);
  leftSideInput.setAttributeNode(lSideID);
  jumbotron.appendChild(leftSideInput);

  var br2 = document.createElement("br");
  jumbotron.appendChild(br2);

  var rightSideLabel_ = document.createElement("label");
  var rightSideLabel = document.createTextNode("5 = ");
  rightSideLabel_.appendChild(rightSideLabel);
  jumbotron.appendChild(rightSideLabel);

  var rightSideInput = document.createElement("input");
  var rightSideInputType = document.createAttribute("type");
  var rSideID = document.createAttribute("id");
  rSideID.value="likertScaleLeftRight";
  rightSideInput.setAttributeNode(rightSideInputType);
  rightSideInput.setAttributeNode(rSideID);
  jumbotron.appendChild(rightSideInput);

  var br3 = document.createElement("br");
  jumbotron.appendChild(br3);

  var saveButton = document.createElement("button");
  var buttonText = document.createTextNode("Save");
  saveButton.appendChild(buttonText);
  var saveButtonClass = document.createAttribute("class");
  saveButtonClass.value="btn-primary";
  saveButton.setAttributeNode(saveButtonClass);
  jumbotron.appendChild(saveButton);

}
