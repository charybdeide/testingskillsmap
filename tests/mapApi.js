'use strict';
var assert = require('assert');
var helper = require('./helper');

describe('/api/map', function () {
  var testServer;
  var cookies;

  before(function(done) {
    helper.before(function(err, server, loginCookies) {
      if(err) {
        return done(err);
      }

      testServer = server;
      cookies = loginCookies;
      done();
    });
  });

  after(function(done) {
    testServer.stop(done);
  });

  it('should return 200', function(done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      }
    }, function (res) {
      assert.equal(res.statusCode, 200);
      done();
    });
  });
});
