var handlebars = require('handlebars');
var Promise = require('promise');

var defaultContext = {
  title: 'Testing skills map',
};

handlebars.registerHelper('login', function(template) {
  var session = template.data.root.session;
  if(!session || !session.user)
  {
    var out = "<a href='/login'>Login</a>";  
  }
  else
    out = session.name + " <a href='/logout'>Logout</a>";
  
  return out; 
})

handlebars.registerHelper('mainButton', function(template) {
  var session = template.data.root.session;
  if(!session || !session.user)
  {
    var out = "<a href='/login' class='btn btn-lg btn-default'>Login to start</a>";
  }
  else
    out = "<a href='/create' class='btn btn-lg btn-default'>Work on your map</a>";
  return out;
})

handlebars.registerHelper('leftMenuButtons', function(template) {
  var session = template.data.root.session;
  if(!session || !session.user)
  {
    var out = "<li><a href='/about'>About</a></li>";
  }
  else
    out = "<li><a href='/about'>About</a></li><li><a href='/create'>Create</a></li><li><a href='/browse'>Browse</a></li>";
  return out;
})

var init = function(server, path) {

  // see: http://hapijs.com/tutorials/views
  server.views({
    engines: {
      html: handlebars
    },

    relativeTo: path,
    path: './views',

    layoutPath: './views/layout',
		layout: true,

    helpersPath: './views/helpers',
    context: defaultContext
  });
};

function validateUser(request) {
  return new Promise(function(resolve, reject) {
    var session = request.session.get('session');
    if (!(session && session.user)) reject(new Error("Unauthorized"));
    else resolve(session);  
  });
  
}

module.exports =  {
  init: init,
  validateUser: validateUser
};
