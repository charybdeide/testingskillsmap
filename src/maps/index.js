'use strict';
var Boom = require('Boom');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testingskillsmap');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connection to DB established');
});

var usermap = mongoose.model('usermap', new mongoose.Schema({
  user: String,
  timestamp: Date,
  step1Data: String,
  knowledgeDimensionData: [{facts: String, concepts: String, procedures: String, cognitiveStrategies: String, models: String, skillsTable: String, attitudes: String, metacognition: String}],
  mapName: String,
  mapData: [{category: String, skills: [String]}],
  isPublished: Boolean
}, {collection: 'usermap'}));


var sendError = function(err, reply) {
  console.log(err);
  reply(Boom.internalServerError);
}

var checkError = function(reply) {
  return function(err) {
    if(err) {
      sendError(reply);
    }
    else
      reply('ok');
  }
}

var init = function(server) {
  server.route({
      method: 'GET',
      path: '/create',
      handler: function (request, reply) {

          reply.view('create', { session: request.session.get('session'),
            js: [
              { src: 'js/main.js' },
              { src: 'js/yourMap.js' },
              ]
          });

      }
  });

  server.route({
      method: 'GET',
      path: '/browse',
      handler: function (request, reply) {

          reply.view('browse', { session: request.session.get('session'),
            js: [
              { src: 'js/main.js' },
              { src: 'js/browseMaps.js' }
              ]
          });

      }
  });

 server.route({
      method: 'GET',
      path: '/api/getMap',
      handler: function (request, reply) {
          var session = request.session.get('session');
          var query = { user: session.user };
          usermap.findOne(query, function(err, record) {
            if(err) {
              sendError(err);
              return;
            }
            return reply(JSON.stringify(record));
          });
      }
  });

  server.route({
    method: ['POST'],
    path: '/api/map',

    handler: function (request, reply) {
      var session = request.session.get('session');
      var query = { user: session.user };

      usermap.findOne(query, function(err, record) {
        if(err) {
          sendError(err);
          return;
        }

        if(!record) {
          var update = {
            user: session.user,
            timestamp: new Date(),
            step1Data: request.payload.step1Data,
            knowledgeDimensionData: request.payload.knowledgeDimensionData,
            mapName: request.payload.mapName,
            mapData: request.payload.mapData,
            isPublished: false
          };
          usermap.create(update, checkError(reply));
        } else {
          var update = {
            timestamp: new Date(),
            step1Data: request.payload.step1Data,
            knowledgeDimensionData: request.payload.knowledgeDimensionData,
            mapName: request.payload.mapName,
            mapData: request.payload.mapData,
          };
          usermap.update(query, update, checkError(reply));
        }

      });
    }
  });

  server.route({
      method: ['POST'],
      path: '/api/mapPublish',

      handler: function (request, reply) {
        var session = request.session.get('session');
        var set = {
          isPublished: true
        };
        var query = {
          user: session.user,
        };
        usermap.update(query, set, checkError(reply));
      }
  });

 server.route({
      method: ['POST'],
      path: '/api/mapUnPublish',

      handler: function (request, reply) {
        var session = request.session.get('session');
        var set = {
          isPublished: false
        };
        var query = {
          user: session.user,
        };
        usermap.update(query, set, checkError(reply));
      }
  });

server.route({
      method: 'GET',
      path: '/api/getPublishedMaps',
      handler: function (request, reply) {

          var query = { isPublished: true };
          usermap.find(query, function(err, record) {
            if(err) {
              sendError(err);
              return;
            }
            return reply(JSON.stringify(record));
          });
      }
  });

};

module.exports = {
  init: init
};
