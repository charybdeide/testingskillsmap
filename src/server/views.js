var handlebars = require('handlebars');

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

module.exports =  {
  init: init
};
