var User = require('../models/User');
var Company = require('../models/Company');
var Test = require('../models/Test');
var Candidate = require('../models/Candidate');
var Interview = require('../models/Interview');

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
//display all
exports.getAllInterview = function(req, res){
  Interview.find({}, function(err, interviews){
    res.render('allInterview', {interviews: interviews});
  });
};
exports.getInterview = function(req, res){
  Interview.find({email: req.params.name}, function(err, interview){
    var interviewCandidate = [];
    for(var i=0;i<interview.length;i++)
      interviewCandidate.push(interview[i].email);
    res.render('interview', {interviewCandidate: interviewCandidate});
  });
};
exports.postInterview = function(req, res){
    //send a mail to candidate to interview
    var userEmail = req.user.email;
      //mail options
      mailOptions = {
        from: 'Interviewer.com ✔ <sobingt@gmail.com>',
        to: req.body.email,
        subject: 'Invitation for interview',
        text: 'You are invited by '+userEmail+' to an interview:'+req.params.name,
        html: "Hello,<br> Below are the details for your interview.<br>"
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
        if(error)
          return console.log(error);
      })
      res.redirect('/test/interview/'+req.params.name);
};

//adding an interview
exports.getAddInterview = function(req, res){
  res.render('addInterview');
};
exports.postAddInterview = function(req, res){
  var interview = new Interview({
    name: req.body.name,
    type: req.body.type
  });
  interview.save();
  res.redirect('/test/interview');
};
