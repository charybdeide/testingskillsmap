'use strict';

var init = function(server) {
  server.route({
        method: 'GET',
        path: '/about',
        handler: function (request, reply) {

          if (request.session.get('session').user == undefined) reply.view('about');
          else
          reply.view('about', { session: request.session.get('session'),
            js: [
             
              ]
          });

        }
    });
}

module.exports = {
  init: init
};
