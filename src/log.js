

module.exports = function() {
  var message = "";

  for(var i in arguments) {
    message += arguments[i] + " ";
  }


  var now = new Date();
  console.log('[' + now + '] ', message);
};
