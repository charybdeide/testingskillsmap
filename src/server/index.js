var Hapi = require('hapi');
var views = require('./views');
var login = require('../login');
var maps = require('../maps');
var about = require('../about');
var firstPage = require('../firstPage');
var session = require('../session');

var init = function(settings, path, callback) {
  var server = new Hapi.Server();
  server.connection({ port: 3000 });

  var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('./logger'),
        events: { 'log': '*', 'request-error': '*', 'ops': '*', 'request': '*', 'response': '*', 'tail': '*' }
    }]
  };

  server.register({
      register: require('good'),
      options: options
  }, function (err) {
      if (err) {
        console.error(err);
      }
  });

  server.register(require('vision'), function (err) {
    if (err) {
      console.error(err);
    }
  });

  server.register(require('inert'), function (err) {
    if (err) {
      console.error(err);
    }
  });

  session.init(server);
  views.init(server, path);
  login.init(server, settings);
  maps.init(server);
  about.init(server);
  firstPage.init(server);


  //error handling
  server.ext('onPreResponse', function (request, reply) {

    var response = request.response;

    if (response.isBoom && request.method === "get" && request.path.indexOf("/api/") === -1) {
        var errName = response.output.payload.error;
        var statusCode = response.output.payload.statusCode;

        if(statusCode === 404) {
          return reply.view('404', {
              statusCode: statusCode,
              errName: errName
          })
          .code(statusCode);
        } else if(statusCode >= 400 && statusCode < 500) {
          return reply.view('400', {
              statusCode: statusCode,
              errName: errName
          })
          .code(statusCode);
        }

      if(statusCode >= 500 && statusCode < 600) {
          return reply.view('500', {
              statusCode: statusCode,
              errName: errName
          })
          .code(statusCode);
        }
    }

    return reply.continue();
  });

  // serve static file
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public/'
      }
    }
  });

  server.start(function () {
    callback(server);
  });
};

module.exports = {
  init: init
};
