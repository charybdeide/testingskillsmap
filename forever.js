var forever = require('forever-monitor');
var log = require('./src/log.js');
 var fs = require("fs");

var child = new (forever.Monitor)('app.js', {
  max: 9999,
  silent: false,
  append: true,
  args: [],
  'logFile': 'log/daemon.log', // Path to log output from forever process (when daemonized)
  'outFile': 'log/out.log', // Path to log output from child stdout
  'errFile': 'log/err.log', // Path to log output from child stderr
});

child.on('exit', function () {
  log('app.js has exited after 9999 restarts');
});

child.on('restart', function () {
  log('app.js restarted for [' + child.times + '] times');
});

child.on('exit:code', function (code) {
  log('app.js has exited with code: ' + code);
});

child.start();

checkLogFile('log/daemon.log');
checkLogFile('log/out.log');
checkLogFile('log/err.log');



function checkLogFile(filename) {
  setInterval(function() {
    console.log("filename ", getFilesizeInBytes(filename));
  }, 1000);
}

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}
