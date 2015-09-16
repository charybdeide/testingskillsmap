var init = function(server, configData) {

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
        location: configData.loginRedirect
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
        location: configData.loginRedirect
    });


});


  server.route({
      method: 'GET',
      path: '/login',
      handler: function (request, reply) {
          reply.view('login');
      }
  });


 server.route({
      method: 'GET',
      path: '/logout',
      handler: function (request, reply) {
          request.session.set('session', {});
          return reply.redirect('/');
      }
  });

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
        var uName = request.auth.credentials.profile.raw.name.split(" ");
        var uFName = uName[0];
        userIdentif = twName;
        request.session.set('session', {'user': twName, 'name': uFName});
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
        var email = request.auth.credentials.profile.email;
        var uFName = request.auth.credentials.profile.name.first;
        request.session.set('session', {'user': email, 'name': uFName});
          return reply.redirect('/');
        }
    }
  });
};

module.exports = {
  init: init
};
