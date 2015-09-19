'use strict';
var chai = require('chai');
var expect = chai.expect;
var helper = require('./helper');

describe('/api/map', function () {
  var testServer;
  var cookies;

  before(function (done) {
    this.timeout(5000);
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

  it('should return 400 if no data is sent in the request', function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      }
    }, function (res) {
      expect(res.statusCode).to.equal(400);
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
      expect(res.statusCode).to.equal(200);
      
      done();
    });
  });

    it('should return 403 if the user is not logged and tries to send map data', function (done) {
      testServer.inject({
        method: 'POST',
        url: '/api/map',
        payload: helper.emptyMap
      }, function (res) {
        expect(res.statusCode).to.equal(403);
        done();
      });
    });
  
});
