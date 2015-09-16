var fs = require('fs');
var server = require('../src/server');
var mongoose = require('mongoose');

function before(callback) {
  var settings = JSON.parse(fs.readFileSync('config.json'));

  mongoose.connect('mongodb://localhost:27017/testingskillsmap_test', function(err) {
    if(err) {
      return callback(err);
    }

    server.init(settings, __dirname + '../', function(server) {
      server.route({
        method: ['GET', 'POST'],
        path: '/auth/force',
        handler: function (request, reply) {
          request.session.set('session', {'user': 'testUser', 'name': 'testName'});
          reply('ok');
        }
      });

      server.inject({
        method: 'POST',
        url: '/auth/force'
      }, function (res) {
        callback(null, server, res.headers['set-cookie'][0]);
      });
    });
  });
}

module.exports = {
  before: before
};
