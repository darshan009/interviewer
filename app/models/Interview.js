var mongoose = require('mongoose');

var interviewSchema = mongoose.Schema({
  name: String,
  type: String,
  email: [{type: String}]
});

module.exports = mongoose.model('Interview', interviewSchema);
