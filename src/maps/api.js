var data = require('./data.js');
var models = require('./models');
var Boom = require('boom');
var validation = require('./validation.js');

var sendError = function (err, reply) {
  var sent = false;

  if (err.name === "ValidationError") {
    sent = Object.keys(err.errors).some(function (element) {
      if (err.errors[element].properties && err.errors[element].properties.message) {
        reply(Boom.badData(err.errors[element].properties.message));
        return true;
      }
    }, this);
  }

  if (!sent) {
    console.error(err);
    reply(Boom.badImplementation(err.message, err));
  }
};

var checkError = function (reply) {
  return function (err) {
    if (err) {
      sendError(err, reply);
    } else {
      reply('ok');
    }
  };
};

function init(server) {
  server.route({
    method: 'GET',
    path: '/api/getMap',
    handler: function (request, reply) {
      var session = request.session.get('session');
      var query = { user: session.user };
      models.usermap.findOne(query, function (err, record) {
        if (err) {
          sendError(err, reply);
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
      if (!validation.isUserLoggedIn(request)) {
        return reply(Boom.forbidden());
      }

      if (!validation.isMapWitMeta(request.payload)) {
        return reply(Boom.badRequest());
      }

      var session = request.session.get('session');
      var query = { user: session.user };

      var mapData = request.payload.map.data;
      var skillsList = data.getSkills(mapData);

      if (skillsList.length !== 0 && !validation.areSkillsNotEmpty(mapData)) {
        return reply(Boom.badData("You need to provide names for skills in your map"));
      }

      var update = {
        user: session.user,
        timestamp: new Date(),
        step1Data: request.payload.step1Data,
        knowledgeDimension: request.payload.knowledgeDimension,
        map: request.payload.map
      };
      models.usermap.update(query, update, { upsert: true, runValidators: true }, function (err) {
        if (err) {
          sendError(err, reply);
        } else {
          models.keywords.findOne(query, function (err, keywordsRecord) {
            if (err) {
              sendError(err, reply);
              return;
            }
            if (!keywordsRecord) {
              models.keywords.create({ user: session.user, keywords: skillsList }, checkError(reply));
            } else {
              models.keywords.update(query, { keywords: skillsList }, checkError(reply));
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

      models.usermap.update(query, set, checkError(reply));
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

      models.usermap.update(query, set, checkError(reply));
    }
  });
}

module.exports = {
  init: init
};
