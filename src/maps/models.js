var mongoose = require('mongoose');

function isEmptyString(value) {
  return value.trim() === "";
}

var usermap = mongoose.model('usermap', new mongoose.Schema({
  user: String,
  timestamp: Date,
  step1Data: String,

  knowledgeDimension: {
    facts: String,
    concepts: String,
    procedures: String,
    cognitiveStrategies: String,
    models: String,
    skillsTable: String,
    attitudes: String,
    metacognition: String
  },

  map: {
      name: String,
      data: [{category: String, skills: [String]}],
  },

  isPublished: { type: Boolean, default: false }
}, {collection: 'usermap'}));

usermap.schema.path('map.name').validate(function(value) {
  return !isEmptyString(value);
}, 'You need to provide a map name');


usermap.schema.path('map.data').schema.path('category').validate(function(value) {
  return !isEmptyString(value);
}, 'You need to provide a map category');

var keywords = mongoose.model('keywords', new mongoose.Schema({
  user: String,
  keywords: [String]
}, {collection: 'keywords'}));

module.exports = {
  keywords: keywords,
  usermap: usermap
};
