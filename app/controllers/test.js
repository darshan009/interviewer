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
    res.render('./test/screening', {tests: tests});
  });
};
//create test
exports.getNewTest = function(req, res, next){
  res.render('./test/newtest');
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
    res.render('./test/testpage', {tests: tests});
  });
};
//test and interview page
exports.getTestInterview = function(req, res){
  res.render('./test/test');
};

//Starting
//sidebar elements
exports.getTeam = function(req, res){
  Test.findById(req.params.id).exec()
    .then(function(tests){
        var hiringTeam = [];
        for(var j=0; j< tests.hiringTeam.length; j++)
          hiringTeam.push(tests.hiringTeam[j]);
        return [hiringTeam, tests];
      })
    .then(function(result){
      var hiringTeam = result[0];
      return User.find({_id: {$in: hiringTeam}}).exec()
        .then(function(users){
          result.push(users);
          return result;
        })
      })
      .then(function(result){
        var tests = result[1];
        var users = result[2];
        console.log(users);
        res.render('./test/team', {tests: tests, users: users});
      })
      .then(undefined, function(err){
        console.log(err);
      });
};
exports.getAddMember = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    res.render('./test/addMember', {tests: tests});
  });
};
exports.postAddMember = function(req, res){
  User.findOne({email: req.body.email}).exec()
    .then(function(users){
      return Test.findById(req.params.id).exec()
        .then(function(tests){
            if(users)
            {
              tests.hiringTeam.push(users._id);
              tests.save();
              //res.redirect('/partial/team/'+tests._id);
              res.end("Successfully added");
            }else{
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
            }
          })
      })
      .then(undefined, function(err){
        console.log(err);
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
    if(err)
      return next(err);
    res.render('./test/questions', {questions: questions, tests: tests});
  });
};
exports.getAddQuestions = function(req, res){
  Test.findById(req.params.id, function(err, tests){
    if(err)
      return next(err);
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
    if(err)
      return next(err);
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
    if(tests)
      res.render('./test/addCandidate', {tests: tests});
  });
};
exports.postAddCandidate = function(req, res){
  Test.findById(req.params.id).exec()
    .then(function(tests){
      return tests;
    })
    .then(function(result){
      var tests = result;
      return Candidate.findOne({email: req.params.email}).exec()
        .then(function(candidate){
            candidate.firstname = req.body.firstname;
            candidate.lastname = req.body.lastname;
            candidate.phone = req.body.phone;
            candidate.save();
            tests.allCandidates = candidate._id;
            tests.save();
            res.redirect("/partial/"+tests._id+"/"+candidate.email+"/givetest");
        });
    })
    .then(undefined, function(err){
      console.log(err);
    });
};

//give tests
exports.getGiveTest = function(req, res){
  Test.findById(req.params.id).exec()
    .then(function(tests){
      return Candidate.findOne({email: req.params.email}).exec()
      .then(function(candidate){
        var questions=[];
        var options= [];
        for(var i=0; i<tests.questions.length; i++){
            questions[i]=tests.questions[i];
            for(var j=0; j<tests.questions[i].opts.length; j++)
              options.push(tests.questions[i].opts[j]);
        return [tests, candidate, options, questions];
        }
      })
    })
      .then(function(result){
        var tests = result[0];
        var candidate = result[1];
        var options = result[2];
        var questions = result[3];
        res.render('./test/giveTest', {
          tests: tests,
          questions: questions,
          options: options,
          candidate: candidate
        });
      })
      .then(undefined, function(err){
        console.log(err);
      });
};
exports.postGiveTest = function(req, res){
  Test.findById(req.params.id).exec()
  .then(function(tests){
    return tests;
  })
  .then(function(result){
    var tests = result;
    return Candidate.findOne({email: req.params.email}).exec()
      .then(function(candidate){
        var answers =[];
        var marks = 0;
        for(var i=0; i<req.body.resultString.length; i++)
        {
          answers.push(req.body.resultString[i]);
        }
        for(var i=0; i<req.body.resultString.length; i++)
        {
          if(answers[i] == tests.questions[i].correct)
            marks+=10;
        }
        candidate.statusCompleted = true;
        tests.testCompleted.push(candidate._id);
        candidate.marks = marks;
        candidate.save();
        tests.save();
        res.end("Your test has been submitted Successfully");
        console.log("End not working");
      })
  })
    .then(undefined, function(err){
      console.log(err);
    });
};

//all candidates
exports.getDisplayAllCandidates = function(req, res){
  Test.findById(req.params.id).exec()
  .then(function(tests){
    var candidates = [];
    for(var i=0; i< tests.allCandidates.length; i++)
      candidates.push(tests.allCandidates[i]);
    return [tests, candidates];
  })
  .then(function(result){
    var tests = result[0];
    var candidates = result[1];
    return Candidate.find({_id: {$in: candidates}}).exec()
      .then(function(candidate){
        result.push(candidate);
        return result;
      })
  })
  .then(function(result){
    var tests = result[0];
    var candidate = result[2];
    res.render('./test/candidates', {tests: tests, candidate: candidate});
  })
  .then(undefined, function(err){
    console.log(err);
  });
};

exports.getCompleted = function(req, res){
  Test.findById(req.params.id).exec()
  .then(function(tests){
    var candidates= [];
    for(var i=0; i<tests.testCompleted.length;i++)
      candidates.push(tests.testCompleted[i]);
    return [tests, candidates];
  })
  .then(function(result){
    var tests = result[0];
    var candidates = result[1];
    return Candidate.find({_id: {$in: candidates}}).exec()
      .then(function(candidate){
        result.push(candidate);
        return result;
      })
  })
  .then(function(result){
    var tests = result[0];
    var candidate = result[2];
    res.render('./test/completed', {
      tests: tests,
      candidate: candidate
    });
  })
  .then(undefined, function(err){
    console.log(err);
  });
};
exports.postCompleted = function(req, res){
  Test.findById(req.params.id).exec()
  .then(function(tests){
    var candidatesAccepted = [];
    var candidatesRejected = [];
    candidatesAccepted.push(req.body.accepted);
    candidatesAccepted.push(req.body.rejected);
    return [tests, candidatesAccepted, candidatesAccepted];
  })
  .then(function(result){
    var tests = result[0];
    var candidatesAccepted = result[1];
    return Candidate.find({_id: {$in: candidatesAccepted}}).exec()
      .then(function(candidateAccept){
        for(var j=0; j<candidateAccept.length; j++){
          //checking if candidate exists in rejected list
          for(var k=0; k<tests.rejected.length; k++){
            if(tests.rejected[k] == candidateAccept[i])
              tests.rejected[k].remove();
          }
          candidateAccept[j].statusAccepted = true;
          tests.accepted.push(candidateAccept[j]._id);
          candidateAccept[j].save();
        }
        tests.save();
        //res.end("Accepted");
      })
  })
  .then(function(result){
    var tests = result[0];
    var candidatesAccepted = result[1];
    return Candidate.find({_id: {$in: candidatesRejected}}).exec()
      .then(function(err, candidateReject){
        for(var i=0; j<candidateReject.length; j++){
          //checking if candidate exists in accepted list
          for(var k=0; k<tests.accepted.length; k++){
            if(tests.accepted[k] == candidateAccept[i])
              tests.accepted[k].remove();
          }
          candidateReject[i].statusRejected = true;
          tests.rejected.push(candidateReject[i]._id);
          candidateReject[i].save();
        }
        tests.save();
        //res.end("Rejected");
      })
  })
  .then(undefined, function(err){
    console.log(err);
  });
};

exports.getAccepted = function(req, res){
  Test.findById(req.params.id).exec()
  .then(function(tests){
    var candidates = [];
    for(var i=0; i<tests.accepted.length;i++)
      candidates.push(tests.accepted[i]);
    return [tests, candidates];
  })
  .then(function(result){
    var tests = result[0];
    var candidates = result[1];
    return Candidate.find({_id: {$in: candidates}}).exec()
    .then(function(candidate){
      result.push(candidate);
      return result;
    })
  })
  .then(function(result){
    var tests = result[0];
    var candidate = result[2];
    res.render('./test/accepted', {
      tests: tests,
      candidate: candidate
    });
  })
  .then(undefined, function(err){
    console.log(err);
  });
};
