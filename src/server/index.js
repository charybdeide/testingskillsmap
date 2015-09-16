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
        path: 'public'
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
