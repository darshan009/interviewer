var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  name: String,
  hiringTeam: [{type: mongoose.Schema.Types.ObjectId}, ref='User'],
  questions: [{
    question: String,
    opts:[String],
    correct: Number
  }],
  companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  testTaker: [{
    candidateId: {type:mongoose.Schema.Types.ObjectId, ref: 'Candidate'},
    question: String,
    correctAns: Number
  }],
  allCandidates: [{type: mongoose.Schema.Types.ObjectId}],
  testCompleted: [{type: mongoose.Schema.Types.ObjectId}],
  accepted: [{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('Test', testSchema);
