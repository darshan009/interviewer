var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname: String,
  phone: String,
  companyId: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('User', userSchema);
