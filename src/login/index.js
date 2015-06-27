var init = function(server) {

  server.route({
      method: 'GET',
      path: '/login',
      handler: function (request, reply) {
          reply.view('login');
      }
  });
};


module.exports = {
  init: init
};
