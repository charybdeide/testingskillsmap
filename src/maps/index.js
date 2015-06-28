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
              { src: 'js/yourMap.js' }
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

      var update = {
        user: session.user,
        timestamp: new Date(),
        mapName: request.payload.mapName,
        mapData: request.payload.mapData,
        isPublished: false
      };

      usermap.findOne(query, function(err, record) {
        if(err) {
          sendError(err);
          return;
        }

        if(!record) {
          usermap.create(update, checkError(reply));
        } else {
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


};

module.exports = {
  init: init
};
