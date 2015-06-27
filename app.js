var Hapi = require('hapi');
var fs = require('fs');

var views = require('./src/server/views');
var login = require('./src/login');
var maps = require('./src/maps');

var filename = "config.json";
var Yar = require('yar');

var configData = JSON.parse(fs.readFileSync(filename));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testingskillsmap');

var server = new Hapi.Server();
server.connection({ port: 3000 });

views.init(server, __dirname);
login.init(server);
maps.init(server);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Connection to DB established");
});

var usermap = mongoose.model('usermap', new mongoose.Schema({
  user: String,
  timestamp: Date,
  mapName: String,
  mapData: [{category: String, skills: [String]}]
}, {collection: 'usermap'}));

var userIdentif;

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

// Register bell with the server
server.register(require('bell'), function (err) {

    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: 'cookie_encryption_password',
        clientId: configData.TwitterClientId,
        clientSecret: configData.TwitterClientSecret,
        isSecure: false,     // Terrible idea but required if not using HTTPS
    });

    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: 'password',
        clientId: configData.GoogleClientId,
        clientSecret: configData.GoogleClientSecret,
        isSecure: false,

        // You'll need to go to https://console.developers.google.com and set up an application to get started
        // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
        // Next, go to "APIs & auth >> Credentials and Create new Client ID
        // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
        // This will net you the clientId and the clientSecret needed.
        // Also be sure to pass the redirect_uri as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
        providerParams: {
            redirect_uri: server.info.uri + '/bell/google'
        }

    });
    // Use the 'twitter' authentication strategy to protect the
    // endpoint handling the incoming authentication credentials.
    // This endpoints usually looks up the third party account in
    // the database and sets some application state (cookie) with
    // the local application account information.
    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/auth/twitter',          // The callback endpoint registered with the provider
        config: {
            auth: 'twitter',
            handler: function (request, reply) {

                // Perform any account lookup or registration, setup local session,
                // and redirect to the application. The third-party credentials are
                // stored in request.auth.credentials. Any query parameters from
                // the initial request are passed back via request.auth.credentials.query.

                //var uName = request.auth.credentials.profile.raw.name;
                var twName = request.auth.credentials.profile.raw.screen_name;
                userIdentif = twName;
                request.session.set('session', {'user': twName});
                return reply.redirect('/');
            }
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/bell/google',
        config: {
            auth: 'google',
            handler: function (request, reply) {
                return reply.redirect('/');
            }
        }
    });
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', { bodyClass: 'index' });
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
      console.log(session);

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
