var forever = require('forever-monitor');
var log = require('./src/log.js');
var fs = require("fs");
var zlib = require('zlib');

var maxLogSize = 1024 * 1024;

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

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats["size"];

  return fileSizeInBytes;
}

function checkLogFile(filename) {
  setInterval(function() {
    try {
      var size = getFilesizeInBytes(filename);

      if(size >= maxLogSize) {
        var now = (new Date()).toISOString().replace(/:/g, "_").replace(/-/g, "_");
        var gzip = zlib.createGzip();
        var inp = fs.createReadStream(filename);
        var out = fs.createWriteStream(filename + "." + now + ".gz");

        inp.pipe(gzip).pipe(out).on('finish', function () {
          fs.writeFile(filename, '');
        });
      }

    } catch (e) {

    }
  }, 5000);
}

checkLogFile('./log/daemon.log');
checkLogFile('./log/out.log');
checkLogFile('./log/err.log');
checkLogFile('./log/resources.csv');
