var mongoose = require('mongoose');

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

  isPublished: Boolean
}, {collection: 'usermap'}));

var keywords = mongoose.model('keywords', new mongoose.Schema({
  user: String,
  keywords: [String]
}, {collection: 'keywords'}));

module.exports = {
  keywords: keywords,
  usermap: usermap
};
