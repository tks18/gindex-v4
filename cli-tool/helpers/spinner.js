var CLI = require('clui'),
    Spinner = CLI.Spinner;
module.exports = function(message, seconds, exFunc){
  if(seconds == 0){
    var countdown = new Spinner(message, ['|', '/', '-', '\\','~']);
    countdown.start();
    var number = 5;
    setInterval(function () {
      number--;
      countdown.message(message);
      if (number === 0) {
        exFunc();
      }
    }, 1000);
  } else {
    var countdown = new Spinner(message + ' ' + seconds +' seconds...  ', ['|', '/', '-', '\\','~']);
    countdown.start();
    var number = seconds;
    setInterval(function () {
      number--;
      countdown.message(message + ' ' + number + ' seconds...  ');
      if (number === 0) {
        exFunc();
      }
    }, 1000);
  }
}
