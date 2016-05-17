var fs = require('fs');

module.exports = function(message) {
  fs.writeFile("./log/resources.csv", message + "\n", { flag: 'a' }, function(err) {
    if(err) {
      console.log(err);
    }
  });
};
