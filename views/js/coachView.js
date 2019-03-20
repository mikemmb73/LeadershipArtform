var emailServices = require('../services/emailServices');

function formatClients(clients){
  console.log("in format clients");
  console.log('im so bored');

  var jumbotron = document.getElementById('clientRow');
  if (jumbotron.style.display === "none") {
    jumbotron.style.display = "block";
  }

  var i;
  for (i = 0; i < clients.length; i++) {
    console.log(clients[i].username);
  }
}

function emailClients(clients) {
  console.log("EMAIL CLIENTS"); 
  console.log(clients); 
  clients.forEach(function(entry) {
    console.log("in here"); 
    console.log(entry.email);
  });
}
