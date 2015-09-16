'use strict';
var fs = require('fs');
var server = require('./src/server');

var settings = JSON.parse(fs.readFileSync('config.json'));

server.init(settings, __dirname, function(server) {
  console.log('Server running at:', server.info.uri);
});
