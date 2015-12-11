var User = require('../models/User');
var Company = require('../models/Company');
var Test = require('../models/Test');
var Candidate = require('../models/Candidate');

var secrets = require('../config/secrets');
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Mandrill',
    auth: {
        user: secrets.email,
        pass: secrets.password
    }
});


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
exports.getAddMember = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    res.render('./test/addMember', {tests: tests});
  });
};
exports.postAddMember = function(req, res){
  User.findOne({email: req.body.email}, function(err, users){
    Test.findById(req.params.id, function(err, tests){
      if(users)
      {
        tests.hiringTeam.push(users._id);
        tests.save();
        res.redirect('/partial/team/'+tests._id);
        res.end("Successfully added");
      }
      //if user does not exist, send signup mail
      userEmail = req.user.email;
      link="http://localhost:4000/signup";
        //mail options
        mailOptions = {
          from: 'Interviewer.com ✔ <sobingt@gmail.com>',
          to: req.body.email,
          subject: 'Invitation for team member',
          text: 'You are invited by '+userEmail+' to join as a team member for '+tests.name,
          html: "Hello,<br> Please Click on the link to create your account.<br><a href="+link+">Click here to join</a>"
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error)
              return console.log(error);
        });
    });
  });
};

//questions part
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
  Test.findById(req.params.id, function(err, tests){
    res.render('./test/addQuestions', {tests: tests});
  });
};
exports.postAddQuestions = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    var data = JSON.parse(req.body.data);
    var questions = {
      question: data.question,
      correct: data.correct
    };
    questions.opts =[];
    questions.opts.push(data.opts);
    tests.questions.push(data);
    tests.save();
    res.end("Question added successfully");
  });
};

//invite candidates
exports.getInvites = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    res.render('./test/invites', {tests: tests});
  });
};
exports.postInvites = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    var candidate = new Candidate({
      email: req.body.email,
      companyId: tests.companyId,
      testId: tests._id
    });
    //send a mail to candidate to sign up
    var userEmail = req.user.email;
    var host=req.get('host');
    var link="http://localhost:4000/partial/"+tests._id+"/"+req.body.email;
      //mail options
      mailOptions = {
        from: 'Interviewer.com ✔ <sobingt@gmail.com>',
        to: req.body.email,
        subject: 'Invitation for test',
        text: 'You are invited by '+userEmail+' to apply for '+tests.name,
        html: "Hello,<br> Please Click on the link to begin with your test.<br><a href="+link+">Click here to start</a>"
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
          if(error)
            return console.log(error);
      })
      candidate.save();
      res.end("Invitation sent successfully");
  });
};

//add a candidate
exports.getAddCandidate = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    res.render('./test/addCandidate', {tests: tests});
  });
};
exports.postAddCandidate = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    Candidate.findOne({email: req.params.candidate}, function(err, candidate){
      candidate.firstname = req.body.firstname;
      candidate.lastname = req.body.lastname;
      candidate.phone = req.body.phone;
      candidate.save();
      res.redirect("/partial/"+tests._id+"/"+candidate.email+"/givetest");
    });
  });
};

//give tests
exports.getGiveTest = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    Candidate.findOne({email: req.params.email}, function(err, candidate){
      var questions = [];
      for(var i=0; i<tests.question; i++)
        questions.push = tests.question[i];
      console.log([questions]);
      res.render('./test/giveTest', {tests: tests, questions: [questions]});
    });
  });
};
exports.postGiveTest = function(req, res){
  Tests.findById(req.params.id, function(err, tests){
    Candidate.findOne({email: req.params.email}, function(err, candidate){
      //store the correct ans for each question
      tests.save();
      res.end();
    });
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
