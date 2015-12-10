var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  phone: String,
  companyId: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'},
  status: { type: Boolean, default: false }
});
//hashing
userSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password'))
  {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt){
    if(err)
      return next(err);
    bcrypt.hash(user.password,salt,null,function(err, hash){
      if(err)
        return next(err);
      user.password = hash;
      next();
    });
  });
});
//compare hashed password
userSchema.methods.comparePassword = function(password, callback){
  var user = this;
  bcrypt.compare(password, user.password, function(err, isMatch){
    if(err)
      return callback(err);
    callback(null,isMatch);
  });
}

module.exports = mongoose.model('User', userSchema);
