var CLI = require('clui'),
    Spinner = CLI.Spinner;
module.exports = function(indefinite, message, seconds, showSec, exFunc){
  if(indefinite){
    var countdown = new Spinner(message, ['G', '-', 'I', 'N','D', 'E', 'X', '-', '-', 'S', 'H', 'A', 'N', '.', 'T', 'K']);
    countdown.start();
    exFunc(countdown);
  } else {
    if(!showSec){
      var countdown = new Spinner(message, ['G', '-', 'I', 'N','D', 'E', 'X', '-', '-', 'S', 'H', 'A', 'N', '.', 'T', 'K']);
      countdown.start();
      var number = 3;
      setInterval(function () {
        number--;
        countdown.message(message);
        if (number === 0) {
          countdown.stop();
          exFunc();
        }
      }, 1000);
    } else {
      var countdown = new Spinner(message + ' ' + seconds +' seconds...  ', ['G', '-', 'I', 'N','D', 'E', 'X', '-', '-', 'S', 'H', 'A', 'N', '.', 'T', 'K']);
      countdown.start();
      var number = seconds;
      setInterval(function () {
        number--;
        countdown.message(message + ' ' + number + ' seconds...  ');
        if (number === 0) {
          countdown.stop();
          exFunc();
        }
      }, 1000);
    }
  }
}
