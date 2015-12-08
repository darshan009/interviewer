var passport = require('passport');
var User = require('../models/User');
var Company = require('../models/Company');
var Test = require('../models/Test');

//adding company
exports.getAddCompany = function(req, res, next){
  res.render('company');
};
exports.postAddCompany = function(req, res, next){
  var company = new Company({
    name: req.body.name
  });
  company.save();
  res.redirect('/');
};

// User signup
exports.getSignUp = function(req, res, next){
  res.render('signup');
};

exports.postSignUp = function(req,res){
  Company.findOne({name: req.body.companyName}, function(err, company){
    var user = new User({
        email:req.body.email,
        password:req.body.password,
        companyId: company._id
    });
    user.save(function(err){
        var error;
        if (!err){
            res.redirect('/');
        }
        else if(err.code === 11000)
            error = "Provided email already exists..! try another.";
        else
            error = "Unable to save register.. Try again";
        res.render('signup', {error: error});
    });
  });
};
//User login
exports.isLogged = function(req, res, next){
  var user = 1;
  if(user)
  {
    next();
  }
  else
    res.render('login');
};
//login logout signup
exports.getLogin = function(req, res, next){
  res.render('login');
};
exports.postLogin = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
      if (err)
        return next(err);
      if(!user){
        res.redirect('/login',{message: info.message});
      }
      req.logIn(user,function(err){
        if(err)
          return next(err);
        res.redirect('/');
      });
    })(req, res, next);
};
exports.getLogout = function(req, res, next){
  req.logout();
  res.redirect('/');
};

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
