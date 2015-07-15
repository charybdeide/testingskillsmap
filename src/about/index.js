'use strict';
var views = require('../server/views');

var init = function(server) {
  server.route({
        method: 'GET',
        path: '/about',
        handler: function (request, reply) {

          views.validateUser(request).then(function(session) {
            reply.view('about', { session: session });
          }).catch(function(err) {
            reply.view('about');
          });

        }
    });
}

module.exports = {
  init: init
};
