var Hapi = require('hapi');
var fs = require('fs');
var filename = "config.json";

var configData = JSON.parse(fs.readFileSync(filename));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testingskillsmap');


var server = new Hapi.Server();
server.connection({ port: 3000 });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Connection to DB established");
});

mongoose.model('mapcollection', new mongoose.Schema({
  userName: String,
  userTwitterHandle: String,
  mapName: String,
  mapData: [{category: String, skills: [String]}]
}, {collection: 'mapcollection'}));

var mapcollection = mongoose.model('mapcollection');

//mapcollection.create({userName: 'Test2'}, function(err,small) {
//  if(err) return handleError(err);
//});

//var query = mapcollection.find(function(err, maps) {
//  if(err) return console.log(err);
//  console.log(maps[1]);
//});

//console.log(query.select('mapData'));


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
        isSecure: false     // Terrible idea but required if not using HTTPS
    });

    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: 'password',
        isSecure: false,

        // You'll need to go to https://console.developers.google.com and set up an application to get started
        // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
        // Next, go to "APIs & auth >> Credentials and Create new Client ID
        // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
        // This will net you the clientId and the clientSecret needed.
        // Also be sure to pass the redirect_uri as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
        clientId: configData.GoogleClientId,
        clientSecret: configData.GoogleClientSecret,
        providerParams: {
            redirect_uri: server.info.uri + '/auth/google'
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
                var uName = request.auth.credentials.profile.raw.name;
                var twName = request.auth.credentials.profile.raw.screen_name;
                mapcollection.create({userName : uName, userTwitterHandle : twName});
                //var query = mapcollection.find({userName : uName},function(err, maps) {
                //  if(err) return console.log(err);
                //  console.log(maps[0]);
                //});
                return reply.redirect('/');
            }
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/auth/google',
        config: {
            auth: 'google',
            handler: function (request, reply) {
                //return reply.redirect('/');
                reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
            }
        }
    });


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
      console.log(request.payload);
      return reply('ok'); }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

