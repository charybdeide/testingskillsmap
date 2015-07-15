'use strict';

var Hapi = require('hapi');
var fs = require('fs');

var views = require('./src/server/views');
var login = require('./src/login');
var maps = require('./src/maps');
var about = require('./src/about');
var session = require('./src/session');

var configFile = 'config.json';

var configData = JSON.parse(fs.readFileSync(configFile));

var server = new Hapi.Server();
server.connection({ port: 3000 });

session.init(server);
views.init(server, __dirname);
login.init(server, configData);
maps.init(server);
about.init(server);


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', {
          bodyClass: 'index',
          session: request.session.get('session')
        });
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


server.start(function () {
    console.log('Server running at:', server.info.uri);
});
