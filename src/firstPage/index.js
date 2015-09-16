'use strict';

var init = function(server) {
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
};

module.exports = {
  init: init
};
