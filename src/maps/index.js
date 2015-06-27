
var init = function(server) {
  server.route({
      method: 'GET',
      path: '/create',
      handler: function (request, reply) {
          reply.view('create', { session: request.session.get('session'),
            js: [
              { src: 'js/main.js' },
              { src: 'js/yourMap.js' }
              ]
          });

      }
  });
};

module.exports = {
  init: init
};
