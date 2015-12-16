var mongoose = require('mongoose');

var candidateSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname: String,
  phone: String,
  companyId: {type: mongoose.Schema.Types.ObjectId},
  testId:  {type: mongoose.Schema.Types.ObjectId},
  marks: Number,
  statusCompleted: {type: Boolean, default: false},
  statusAccepted: {type: Boolean, default: false},
  statusRejected: {type: Boolean, default: false}
});

module.exports = mongoose.model('Candidate', candidateSchema);
