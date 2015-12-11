var mongoose = require('mongoose');

var candidateSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname: String,
  phone: String,
  companyId: {type: mongoose.Schema.Types.ObjectId},
  testId:  {type: mongoose.Schema.Types.ObjectId}
});

module.exports = mongoose.model('Candidate', candidateSchema);
