var log = require('../log.js');

function GoodReporterExample (events, config) {

    if (!(this instanceof GoodReporterExample)) {
        return new GoodReporterExample(events, config);
    }
}

GoodReporterExample.prototype.init = function (readstream, emitter, callback) {
  log('Init hapi logger');

  readstream.on('data', function(data) {

    if(data.event === "response") {
      log(data.method,
          data.path,
          " => code:", data.statusCode,
          "in:", data.responseTime, "ms",
          "SOURCE:", data.source.remoteAddress,
          data.source.userAgent,
          data.source.referer ? data.source.referer : "NO REFFERER");
    } else if(data.event !== "ops") {

      console.log("===>", data);
    }
  });


  emitter.on('stop', function () {
      console.log('some clean up logic.');
  });

  callback();
};

GoodReporterExample.attributes = {
    name: 'good-reporter-example'
};

module.exports = GoodReporterExample;
