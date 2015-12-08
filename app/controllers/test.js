var User = require('../models/User');
var Company = require('../models/Company');
var Test = require('../models/Test');

exports.getTeam = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    res.render('./test/team');
  });
};
exports.getQuestions = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    res.render('./test/questions');
  });
};
exports.getCandidates = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    res.render('./test/candidates');
  });
};
exports.getCompleted = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    res.render('./test/completed');
  });
};
exports.getAccepted = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    res.render('./test/accepted');
  });
};
