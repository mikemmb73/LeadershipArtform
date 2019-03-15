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

function goToFunction() {
  console.log('came here');
  
}
