var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  name: String,
  hiringTeam: [{type: mongoose.Schema.Types.ObjectId}],
  questions: [{type: String}],
  companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  allCandidates: [{type: mongoose.Schema.Types.ObjectId}],
  testCompleted: [{type: mongoose.Schema.Types.ObjectId}],
  accepted: [{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('Test', testSchema);
