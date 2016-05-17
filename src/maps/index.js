'use strict';
var views = require('../server/views');
var api = require('./api');
var models = require('./models');
var data = require('./data');
var Boom = require('boom');

var sendError = function(err, reply) {
  return reply(Boom.badRequest(err.message));
};

var unauthorizedError = function(reply, err) {
    if(err) {
      console.error(err);
    }

    return reply(Boom.unauthorized(err.message));
};

var init = function(server) {
  api.init(server);

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
          return unauthorizedError(reply, err);
        });
      }
  });

  server.route({
      method: 'GET',
      path: '/browse',
      handler: function (request, reply) {

          views.validateUser(request).then(function() {
            models.usermap.find({ isPublished: true }, function (err, records) {
              if(err) {
                return sendError(err, reply);
              }

              reply.view('browse', {
                maps: data.previewMaps(records),
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
            return unauthorizedError(reply, err);
          });
      }
  });

  server.route({
      method: 'GET',
      path: '/browse/{id}',
      handler: function (request, reply) {

        var query = { _id: request.params.id, isPublished: true};
        models.usermap.findOne(query, {map: true}, function (err, record) {
          if (err) {
            return sendError(err, reply);
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
};

module.exports = {
  init: init
};
