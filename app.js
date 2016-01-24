'use strict';
var fs = require('fs');
var server = require('./src/server');
var mongoose = require('mongoose');
var log = require('./src/log.js');

var settings = JSON.parse(fs.readFileSync('config.json'));
mongoose.connect('mongodb://localhost:27017/testingskillsmap', function(err) {
  if(err) {
    return log('Connection to DB failed');
  }

  log('Connection to DB established');

  server.init(settings, __dirname, function(server) {
    log('Server running at:', server.info.uri);
  });
});
