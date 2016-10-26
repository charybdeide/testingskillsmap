'use strict';
var chai = require('chai');
var expect = chai.expect;
var extend = require('extend');
var helper = require('./helper');
var mongoose = require('mongoose');

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
    mongoose.connection.db.dropDatabase().then(function() {
        testServer.stop(done);
    });

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

  it('should return 200 if map with only title is sent', function (done) {
    var payload = {};
    extend(true, payload, helper.titleOnlyMap, { map: { name: "test" }});

    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      },
      payload: payload
    }, function (res) {
      expect(res.statusCode).to.equal(200);

      done();
    });
  });

  it('should return 200 if map with only title and categories is sent', function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      },
      payload:  {
      "step1Data" : "",
      "isPublished" : false,
      "map" : {
        "name" : "testMap title",
        "data" : [ {"category": "category1"}]
       }}}, function (res) {
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

  it('should return 422 if empty strings data is sent in map', function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      },
      payload: helper.emptyMap
    }, function (res) {
      expect(res.statusCode).to.equal(422);

      done();
    });
  });

  it("should return 422 if skills are empty strings", function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      },
      payload:  {
      "step1Data" : "",
      "isPublished" : true,
      "map" : {
        "name" : "testMap title",
        "data" : [ {"category": "category1", "skills" : ["skill1", "", ""]}],
        "knowledgeDimension" : {
          "facts" : "",
          "concepts" : "",
          "procedures" : "",
          "cognitiveStrategies" : "",
          "models" : "",
          "skillsTable" : "",
          "attitudes" : "",
          "metacognition" : "" }
       }}}, function (res) {
      expect(res.statusCode).to.equal(422);
      done();
    });
  });

   it("should return 422 if skills are strings which contain only spaces", function (done) {
    testServer.inject({
      method: 'POST',
      url: '/api/map',
      headers: {
        Cookie: cookies
      },
      payload:  {
      "step1Data" : "",
      "isPublished" : true,
      "map" : {
        "name" : "testMap title",
        "data" : [ {"category": "category1", "skills" : ["skill1", " ", " "]}],
        "knowledgeDimension" : {
          "facts" : "",
          "concepts" : "",
          "procedures" : "",
          "cognitiveStrategies" : "",
          "models" : "",
          "skillsTable" : "",
          "attitudes" : "",
          "metacognition" : "" }
       }}}, function (res) {
      expect(res.statusCode).to.equal(422);
      done();
    });
  });

});
