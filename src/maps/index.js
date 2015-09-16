'use strict';

var Boom = require('boom');
var mongoose = require('mongoose');
var data = require('./data.js');
var views = require('../server/views');

var usermap = mongoose.model('usermap', new mongoose.Schema({
  user: String,
  timestamp: Date,
  step1Data: String,

  knowledgeDimension: {
    facts: String,
    concepts: String,
    procedures: String,
    cognitiveStrategies: String,
    models: String,
    skillsTable: String,
    attitudes: String,
    metacognition: String
  },

  map: {
      name: String,
      data: [{category: String, skills: [String]}],
  },

  isPublished: Boolean
}, {collection: 'usermap'}));

var keywords = mongoose.model('keywords', new mongoose.Schema({
  user: String,
  keywords: [String]
}, {collection: 'keywords'}));



var sendError = function(err, reply) {
  console.error(err);
  reply(Boom.internalServerError);
};

var unauthorizedError = function(reply, err) {
    if(err) {
      console.error(err);
    }
    reply(Boom.unauthorized(err.message));
};

var checkError = function(reply) {
  return function(err) {
    if(err) {
      sendError(err, reply);
    } else {
      reply('ok');
    }
  };
};

var init = function(server) {
  server.route({
      method: 'GET',
      path: '/create',
      handler: function (request, reply) {
          views.validateUser(request).then(function(session) {
            reply.view('create', { session: session,
            js: [
              { src: 'js/main.js' },
              { src: 'js/yourMap.js' },
              { src: 'js/aloha.min.js' }
              ]
            });
          }).catch(function(err) {
            unauthorizedError(reply, err);
          });

      }
  });

  server.route({
      method: 'GET',
      path: '/browse',
      handler: function (request, reply) {

          views.validateUser(request).then(function() {
            usermap.find({ isPublished: true }, function (err, records) {
              if(err) {
                return sendError(err);
              }

              reply.view('browse', {
                maps: previewMaps(records),
                session: request.session.get('session'),
                js: [
                  { src: 'js/main.js' },
                  { src: 'js/browseMaps.js' },
                  { src: 'js/snap.svg-min.js'},
                  { src: 'js/aloha.min.js' }
                  ]
              });
            });

          }).catch(function(err) {
            unauthorizedError(reply, err);
          });

      }
  });

  server.route({
      method: 'GET',
      path: '/browse/{id}',
      handler: function (request, reply) {

        var query = { _id: request.params.id, isPublished: true};
        usermap.findOne(query, {map: true}, function (err, record) {
          if (err) {
            sendError(err);
            return;
          }

          return reply.view('map',  {
                map: record.map,
                session: request.session.get('session'),
                js: [
                  { src: '/js/main.js' },
                  { src: '/js/browseMaps.js' },
                  { src: '/js/snap.svg-min.js'},
                  { src: '/js/aloha.min.js' }
                  ]
              });
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

      if(request.payload.mapData) {
        var skillsList = data.getSkills(request.payload.mapData);
      }

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
            knowledgeDimension: request.payload.knowledgeDimension,
            map: request.payload.map,
            isPublished: false
          };
          usermap.create(update, function(err) {
            if(err) {
              sendError(reply);
            }
            else {
              keywords.create({user: session.user, keywords: skillsList}, checkError(reply));
            }
          });
        } else {
          var update = {
            timestamp: new Date(),
            step1Data: request.payload.step1Data,
            knowledgeDimension: request.payload.knowledgeDimension,
            map: request.payload.map,
          };
          usermap.update(query, update, function(err) {
            if(err) {
              sendError(reply);
            }
            else
            {
              keywords.findOne(query, function(err, keywordsRecord) {
                if(err) {
                  sendError(err);
                  return;
                }
                if(!keywordsRecord) {
                  keywords.create({user: session.user, keywords: skillsList}, checkError(reply));
                } else {
                  keywords.update(query, {keywords: skillsList}, checkError(reply));
                }
              });
            }
          });
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
};

function previewMaps(maps) {
  var previews = [];

  for(var i in maps) {
    var categoriesList = [];
    for(var j in maps[i].map.data) {
      var catWidth;
      var catName;

      if (maps[i].map.data[j].category || (maps[i].map.data[j].category == "" && maps[i].map.data[j].skills != ""))
      {
        catName = maps[i].map.data[j].category;
        var skillsCount = maps[i].map.data[j].skills.length;
        catWidth = Math.min(skillsCount * 2, 90);
        categoriesList.push({
          width: catWidth,
          name: catName,
          zindex: 100-catWidth
        });
      }
    }
    previews.push({
        id: maps[i]._id,
        name: maps[i].map.name,
        categories: categoriesList
      });
  }
  return previews;
}

module.exports = {
  init: init,
  previewMaps: previewMaps
};
