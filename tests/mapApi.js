'use strict';
var should = require('should');
var helper = require('./helper');

describe('/api/map', function () {
  var testServer;
  var cookies;

  before(function (done) {
    helper.before(function (err, server, loginCookies) {
      if (err) {
        return done(err);
      }

      testServer = server;
      cookies = loginCookies;
      done();
    });
  });

  after(function (done) {
    testServer.stop(done);
  });

  it('should return 400 if no map is sent in the request', function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      }
    }, function (res) {
      res.statusCode.should.equal(400);
      done();
    });
  });

  it('should return 200 if valid data is sent', function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      },
      payload: helper.emptyMap
    }, function (res) {
      res.statusCode.should.equal(200);
      done();
    });
  });

  it('should return 403 if the user is not logged and tries to send map data', function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      payload: helper.emptyMap
    }, function (res) {
      res.statusCode.should.equal(300);
      done();
    });
  });

});
