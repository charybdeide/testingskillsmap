var forever = require('forever-monitor');

var child = new (forever.Monitor)('app.js', {
  max: 9999,
  silent: true,
  args: [],
  'logFile': 'log/daemon.log', // Path to log output from forever process (when daemonized)
  'outFile': 'log/out.log', // Path to log output from child stdout
  'errFile': 'log/err.log', // Path to log output from child stderr
});

child.on('exit', function () {
  console.log('app.js has exited after 9999 restarts');
});

child.start();
