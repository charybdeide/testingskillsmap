'use strict';

var Hapi = require('hapi');
var fs = require('fs');

var views = require('./src/server/views');
var login = require('./src/login');
var maps = require('./src/maps');

var filename = 'config.json';
var Yar = require('yar');

var configData = JSON.parse(fs.readFileSync(filename));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testingskillsmap');

var server = new Hapi.Server();
server.connection({ port: 3000 });

views.init(server, __dirname);
login.init(server, configData);
maps.init(server);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connection to DB established');
});

var usermap = mongoose.model('usermap', new mongoose.Schema({
  user: String,
  timestamp: Date,
  mapName: String,
  mapData: [{category: String, skills: [String]}]
}, {collection: 'usermap'}));

var options = {
    cookieOptions: {
        password: 'password',   // Required
        isSecure: false // Required if using http
    }
};


server.register({
    register: Yar,
    options: options
}, function (err) {
  if(err) {
    console.log(err);
  }
});


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', { session: request.session.get('session') });
    }
});

// serve static file
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.route({
    method: ['POST'],
    path: '/api/map',

    handler: function (request, reply) {
      var session = request.session.get('session');
      var update = {
        user: session.user,
        timestamp: new Date(),
        mapName: request.payload.mapName,
        mapData: request.payload.mapData
      };

      usermap.create(update);
      
      return reply(session.user); }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
