var timeoutWarning = 600000;
var timeoutNow = 600000;
var logoutUrl = '/';

var warningTimer;
var timeoutTimer;

function StartTimeoutTimer() {
  timeoutTimer = setTimeout("IdleTimeout()", timeoutNow);
}

function ResetTimeoutTimer() {
  clearTimeout(timeoutTimer);
  console.log("cleared");
  StartTimeoutTimer();
}
function IdleTimeout() {
  window.location = logoutUrl;
}

$(document).ready(function() {
  StartTimeoutTimer();
})

$(document).mousemove(ResetTimeoutTimer);
