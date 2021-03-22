var emailServices = require('../services/emailservices');

$(document).ready(function() {
  $("body").on("click", "#sendReminderButton", function() {
    let email = $(event.target).closest('div').find('input').val();
    emailServices.sendOneReminder(email);
    // alert(email);
  })
})
