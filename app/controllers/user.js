var passport = require('passport');
var User = require('../models/User');
var Company = require('../models/Company');
var Test = require('../models/Test');
var secrets = require('../config/secrets');
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Mandrill',
    auth: {
        user: 'secrets.email',
        pass: 'email.password'
    }
});

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
  //sending Verification mail
  rand=Math.floor((Math.random() * 100) + 54);
  host=req.get('host');
  link="http://localhost:4000/"+user.email+"/verify?id="+rand;
    //mail options
    mailOptions = {
      from: 'Interviewer.com ✔ <sobingt@gmail.com>',
      to: req.body.email,
      subject: 'Account Creation',
      text: 'Below is a test link. Kindly click the link to get started with your interviewer Account',
      html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error)
          return console.log(error);
    });
    user.save(function(err){
        if (!err)
            res.end("<h1> Verification mail has been sent to your email </h1>");
        else if(err.code === 11000)
            error = "Provided email already exists..! try another.";
        else
            error = "Unable to save register.. Try again";
    });
  });
};
//verify user
exports.getVerify = function(req, res){
  if((req.protocol+"://localhost:4000")==("http://localhost:4000"))
  {
    if(req.query.id==rand)
    {
      User.findOne({email: req.params.email}, function(err, users){
          res.end("<h1>Email "+mailOptions.to+" is been successfully verified");
          users.status = true;
          users.save();
      });
    }
    else {
      res.end("<h1> Bad Request </h1>");
    }
  }
  else {
    res.end("<h1> Request from unknown source");
  }
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
exports.getLogin = function(req, res){
  res.render('login');
};
exports.postLogin = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
      if (err)
        return next(err);
      if(!user){
        res.redirect('/login',{message: info.message});
      }
      if(user.status){
        req.logIn(user,function(err){
          if(err)
            return next(err);
          res.redirect('/');
        });
      }
      res.end("User is not verified");
    })(req, res, next);
};
exports.getLogout = function(req, res, next){
  req.logout();
  res.redirect('/');
};
