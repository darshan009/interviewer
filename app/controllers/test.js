var User = require('../models/User');
var Company = require('../models/Company');
var Test = require('../models/Test');


//tests
exports.getTest = function(req, res){
  res.render('test');
};
exports.getTestScreening = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    if(err)
      return next(err);
    res.render('screening', {tests: tests});
  });
};
//create test
exports.getNewTest = function(req, res, next){
  res.render('newtest');
};
exports.postNewTest = function(req, res, next){
  var test = new Test({
    name: req.body.name,
    companyId: req.user.companyId,
    hiringTeam: req.user._id
  });
  test.save();
  res.redirect('/test/screening');
};
//test page
exports.getTest = function(req, res){
  Test.findOne({name: req.params.name}, function(err, tests){
    if(err)
      return next(err);
    res.render('testpage', {tests: tests});
  });
};
//test and interview page
exports.getTestInterview = function(req, res){
  res.render('test');
};

//Starting
//sidebar elements
exports.getTeam = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    var hiringTeam = [];
      for(var j=0; j< tests.hiringTeam.length; j++)
        hiringTeam.push(tests.hiringTeam[j]);
    User.find({_id: {$in: hiringTeam}}, function(err, users){
      res.render('./test/team', {tests: tests, users: users});
    });
  });
};
exports.getaddMember = function(req, res){
  res.render('./test/addMember');
};
exports.postaddMember = function(req, res){
  User.findOne({email: req.body.email}, function(err, users){
    if(users)
    {

    }
  });
};
exports.getQuestions = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    if(tests){
      var questions = [];
      for(var i=0; i< tests.questions.length; i++)
        questions.push(tests.questions[i]);
    }
    res.render('./test/questions', {questions: [questions], tests: tests});
  });
};
exports.getAddQuestions = function(req, res){
  res.render('./test/addQuestions');
};
exports.getAddQuestions = function(req, res){
  var test = new Test({

  });
};
//invite candidates
exports.getCompleted = function(req, res){
  Test.find({companyId: req.user.companyId}, function(err, tests){
    res.render('./test/completed');
  });
};
//all candidates
exports.getCandidates = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    var candidates = [];
    if(tests){
      for(var i=0; i< tests.allCandidates.length; i++)
        candidates.push(tests.allCandidates[i]);
    }
    User.find({_id: {$in: candidates}}, function(err, users){
      res.render('./test/candidates', {tests: tests, users: users});
    });
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
