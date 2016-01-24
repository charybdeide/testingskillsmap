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
