var handlebars = require('handlebars');

var defaultContext = {
  title: 'Testing skills map'
};


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
