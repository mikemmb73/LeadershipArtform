var jCount = 0;
var likertIndex = 0;
var mcIndex = 0;
var freeResponseIndex = 0;
var numQuestions = 0;
var numDelete = 0;

function mcDropdown(){

  var thisIndex = mcIndex;
  var jumbotron = document.createElement("div");
  var jumboID = "jumbotron" + numQuestions;
  console.log(jumboID);
  jumbotron.setAttribute("id", jumboID);
  numQuestions++;
  var jumbotronAtt = document.createAttribute("class");
  jumbotronAtt.value = "jumbotron";
  jumbotron.setAttributeNode(jumbotronAtt);


  var bigJumbo = document.getElementById("questionCard");
  bigJumbo.appendChild(jumbotron);


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
    numDelete++;
    var allQuestions = document.getElementById("questionCard");
    for (var i=0; i<allQuestions.childNodes.length; i++) {
      console.log(allQuestions.childNodes[i]);
      if (allQuestions.childNodes[i].id == jumboID) {
        console.log("found child, deleting");
        allQuestions.removeChild(allQuestions.childNodes[i]);
      }
    }
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
  var inputName = document.createAttribute("name");
  inputType.value="textarea";
  inputName.value="mcQuestions[" + mcIndex + "][0]";
  inputTitle.setAttributeNode(inputType);
  inputTitle.setAttributeNode(inputName);
  inputTitle.required = true;
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
  var option1Name = document.createAttribute("name");
  option1Type.value="textarea";
  option1Name.value = "mcQuestions[" + mcIndex + "][1]";
  option1Title.setAttributeNode(option1Type);
  option1Title.setAttributeNode(option1Name);
  option1Title.required = true;
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
  var option2Name = document.createAttribute("name");
  option2Type.value="textarea";
  option2Name.value="mcQuestions[" + mcIndex + "][2]";
  option2Title.setAttributeNode(option2Type);
  option2Title.setAttributeNode(option2Name);
  option2Title.required = true;
  jumbotron.appendChild(option2Title);


  //Add Option button
  var addOptionButton = document.createElement("button");
  addOptionButton.type = "button";
  var buttonText = document.createTextNode("Add Option");
  addOptionButton.appendChild(buttonText);
  var addOptionButtonStyle = document.createAttribute("style");
  addOptionButtonStyle.value = "margin-left:10px;"
  addOptionButton.setAttributeNode(addOptionButtonStyle);
  var addOptionButtonClass = document.createAttribute("class");
  addOptionButtonClass.value="btn-primary";
  addOptionButton.setAttributeNode(addOptionButtonClass);
  jumbotron.appendChild(addOptionButton);  

  var br2 = document.createElement("br");
   jumbotron.appendChild(br2);

  var num = 3;
  var optionIndex = 3;
  addOptionButton.onclick = function() {
    var option3TitleLabel_ = document.createElement("label");
    var numVal = "Option " + num + " Value: ";
    var option3TitleLabel = document.createTextNode(numVal);
    questionTitleLabel_.appendChild(option3TitleLabel);

    jumbotron.appendChild(option3TitleLabel);

//Area for coach to type in Question Title
    var option3Title = document.createElement("input");
    var option3Type = document.createAttribute("type");
    var option3Name = document.createAttribute("name");
    option3Type.value="textarea";
    //option3Name.value = "mcQuestions[" + thisIndex + "][option" + optionIndex + "]";
    option3Name.value = "mcQuestions[" + thisIndex + "][" + optionIndex + "]";
    option3Title.setAttributeNode(option3Type);
    option3Title.setAttributeNode(option3Name);
    option3Title.required = true;
    jumbotron.appendChild(option3Title);
    var br2 = document.createElement("br");
    jumbotron.appendChild(br2);
    num++;
    optionIndex++;
  };

  mcIndex = mcIndex + 1;

}

// ==================FREE RESPONSE====================================

function freeResponseDropdown(){

  var jumbotron = document.createElement("div");
  var jumbotronAtt = document.createAttribute("class");
  jumbotronAtt.value = "jumbotron";
  var jumboID = "jumbotron" + numQuestions;
  console.log(jumboID);
  jumbotron.setAttribute("id", jumboID);
  numQuestions++;
  jumbotron.setAttributeNode(jumbotronAtt);
  var bigJumbo = document.getElementById("questionCard");
  bigJumbo.appendChild(jumbotron);

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
    numDelete++;
    jumbotron.style.display = "none";
    var allQuestions = document.getElementById("questionCard");
    for (var i=0; i<allQuestions.childNodes.length; i++) {
      console.log(allQuestions.childNodes[i]);
      if (allQuestions.childNodes[i].id == jumboID) {
        console.log("found child, deleting");
        allQuestions.removeChild(allQuestions.childNodes[i]);
      }
    }
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
  var inputName = document.createAttribute("name");
  inputName.value="frQuestions[" + freeResponseIndex  + "]";
  inputType.value="textarea";
  inputTitle.setAttributeNode(inputType);
  inputTitle.setAttributeNode(inputName);
  var inputTitleID = document.createAttribute("id");
  inputTitleID.value="freeResponseQuestion";
  inputTitle.setAttributeNode(inputTitleID);
  inputTitle.required = true;
  jumbotron.appendChild(inputTitle);

  var br2 = document.createElement("br");
  jumbotron.appendChild(br2);

  freeResponseIndex++;
}

// ==================LIKERT====================================

function likertDropdown(){
  var jumbotron = document.createElement("div");
  var jumboID = "jumbotron" + numQuestions;
  console.log(jumboID);
  jumbotron.setAttribute("id", jumboID);
  numQuestions++;
  var jumbotronAtt = document.createAttribute("class");
  jumbotronAtt.value = "jumbotron";

  //jumbotron id
  var jumbotronID = document.createAttribute("id");
  jumbotronID.value="newQuestionJumbotron" + jCount;
  //console.log("jumbotronID is " + jumbotronID.value);
  //console.log("jCount is now " + jCount);
  jumbotron.setAttributeNode(jumbotronID);
  jumbotron.setAttributeNode(jumbotronAtt);
  var bigJumbo = document.getElementById("questionCard");
  bigJumbo.appendChild(jumbotron);

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
    numDelete++;
    jumbotron.style.display = "none";
    var allQuestions = document.getElementById("questionCard");
    for (var i=0; i<allQuestions.childNodes.length; i++) {
      console.log(allQuestions.childNodes[i]);
      if (allQuestions.childNodes[i].id == jumboID) {
        console.log("found child, deleting");
        allQuestions.removeChild(allQuestions.childNodes[i]);
      }
    }
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
  var inputQuestionName = document.createAttribute("name");
  inputQuestionName.value = "likertQuestions[" + likertIndex + "][0]";
  inputQuestionID.value="likertQuestion";
  inputQuestion.setAttributeNode(inputQuestionType);
  inputQuestion.setAttributeNode(inputQuestionID);
  inputQuestion.setAttributeNode(inputQuestionName);
  inputQuestion.required = true;
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
  var leftSideName = document.createAttribute("name");
  leftSideName.value = "likertQuestions[" + likertIndex + "][1]";
  lSideID.value="likertScaleLeft";
  leftSideInput.setAttributeNode(leftSideInputType);
  leftSideInput.setAttributeNode(lSideID);
  leftSideInput.setAttributeNode(leftSideName);
  leftSideInput.required = true;
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
  var rightSideName = document.createAttribute("name");
  rSideID.value="likertScaleRight";
  rightSideName.value = "likertQuestions[" + likertIndex + "][2]";
  rightSideInput.setAttributeNode(rightSideInputType);
  rightSideInput.setAttributeNode(rSideID);
  rightSideInput.setAttributeNode(rightSideName);
  rightSideInput.required = true;
  jumbotron.appendChild(rightSideInput);

  var br3 = document.createElement("br");
  jumbotron.appendChild(br3);

  likertIndex++;
}

// ==================ADD QUESTION====================================
function addQuestion(){
  //console.log("in add question");
  var card = document.createElement("div");
  var cardAtt = document.createAttribute("class");
  cardAtt.value="card text-black bg-primary-mb-3";
  card.setAttributeNode(cardAtt);

  var originalJumbotron = document.getElementById("questionJumbotron");
  originalJumbotron.appendChild(card);

  var cardBody = document.createElement("div");
  var cardBodyAtt = document.createAttribute("class");
  cardBodyAtt.value = "card-body";
  cardBody.setAttributeNode(cardBodyAtt);
  card.appendChild(cardBody);
  var form = document.createElement("form");

  var input1 = document.createElement("input");
  var input1Type = document.createAttribute("type");
  input1Type.value = "button";
  var input1Class = document.createAttribute("class");
  input1Class.value = "btn btn-sm btn-primary";
  var input1Style = document.createAttribute("style");
  input1Style.value = "margin-left:15px;"
  var input1ID = document.createAttribute("id");
  input1ID.value = "mcButton";
  var input1Value = document.createAttribute("value");
  input1Value.value = "Multiple Choice";
  var input1Func = document.createAttribute("onclick");
  input1Func.value="mcDropdown()";
  input1.setAttributeNode(input1Type);
  input1.setAttributeNode(input1Class);
  input1.setAttributeNode(input1Style);
  input1.setAttributeNode(input1ID);
  input1.setAttributeNode(input1Value);
  input1.setAttributeNode(input1Func);
  cardBody.appendChild(input1);

  var input2 = document.createElement("input");
  var input2Type = document.createAttribute("type");
  input2Type.value = "button";
  var input2Class = document.createAttribute("class");
  input2Class.value = "btn btn-sm btn-primary";
  var input2Style = document.createAttribute("style");
  input2Style.value = "margin-left:15px;"
  var input2ID = document.createAttribute("id");
  input2ID.value = "freeResponseButton";
  var input2Value = document.createAttribute("value");
  input2Value.value = "Free Response";
  var input2Func = document.createAttribute("onclick");
  input2Func.value="freeResponseDropdown()";
  input2.setAttributeNode(input2Type);
  input2.setAttributeNode(input2Class);
  input2.setAttributeNode(input2Style);
  input2.setAttributeNode(input2ID);
  input2.setAttributeNode(input2Value);
  input2.setAttributeNode(input2Func);
  cardBody.appendChild(input2);

  var input3 = document.createElement("input");
  var input3Type = document.createAttribute("type");
  input3Type.value = "button";
  var input3Class = document.createAttribute("class");
  input3Class.value = "btn btn-sm btn-primary";
  var input3Style = document.createAttribute("style");
  input3Style.value = "margin-left:15px;"
  var input3ID = document.createAttribute("id");
  input3ID.value = "likertButton";
  var input3Value = document.createAttribute("value");
  input3Value.value = "Likert Scale";
  var input3Func = document.createAttribute("onclick");
  input3Func.value="likertDropdown()";
  input3.setAttributeNode(input3Type);
  input3.setAttributeNode(input3Class);
  input3.setAttributeNode(input3Style);
  input3.setAttributeNode(input3ID);
  input3.setAttributeNode(input3Value);
  input3.setAttributeNode(input3Func);
  cardBody.appendChild(input3);

}

function displaySave(result){
  jCount++;
  var count = result;
  //Likert
  var likertQuestion = document.getElementById("likertQuestion").value;
  var likertScaleLeft = document.getElementById("likertScaleLeft").value;
  var likertScaleRight = document.getElementById("likertScaleRight").value;

  var id = "newQuestionJumbotron" + count;
  //console.log("id is " + id);
  var jumbotron = document.getElementById(id);
  while (jumbotron.firstChild) {
    jumbotron.removeChild(jumbotron.firstChild);
  }

  var savedQuestion = document.createElement("h6");
  var savedQuestionText = document.createTextNode(likertQuestion);
  savedQuestion.appendChild(savedQuestionText);
  jumbotron.appendChild(savedQuestion);
  var savedLeft = document.createElement("p");
  var savedLeftText = document.createTextNode(likertScaleLeft);
  savedLeft.appendChild(savedLeftText);
  jumbotron.appendChild(savedLeft);
  var savedRight = document.createElement("p");
  var savedRightText = document.createTextNode(likertScaleRight);
  savedRight.appendChild(savedRightText);
  jumbotron.appendChild(savedRight);


}

function checkGoal() {
  if (numQuestions - numDelete == 0) {
    alert("Please enter at least one question.")
  } else {
    if (document.getElementById("goalForm").checkValidity()) {
      var title = document.forms["goalForm"]["goalTitle"].value;
      var description = document.forms["goalForm"]["goalDescription"].value;
      if (title == "" || description == "") {
        alert("Please Fill in All Required Fields");
      } else {
        document.getElementById("goalForm").submit();
      }
    } else {

      alert("Please Fill in All Required Fields.")
    }
  }
}

function previousGoal() {
  document.getElementById("goalForm").submit();
}
