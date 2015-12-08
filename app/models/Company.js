var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Company', companySchema);
