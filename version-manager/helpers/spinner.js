var CLI = require('clui'),
  Spinner = CLI.Spinner;

module.exports = function (message, exFunc) {
  var countdown = new Spinner(message, [
    'G',
    '-',
    'I',
    'N',
    'D',
    'E',
    'X',
    '-',
    '-',
    'S',
    'H',
    'A',
    'N',
    '.',
    'T',
    'K',
  ]);
  countdown.start();
  exFunc(countdown);
};
