var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var passportConf = require('./config/passport');
var MongoStore = require('connect-mongo')(session);
var secrets = require('./config/secrets');

var app = express();

//mongoose connection
mongoose.connect(secrets.mongodburl);
mongoose.connection.on('error', function(){
  console.log("Mongoose connection error");
});

//views, bodyparser, cookieParser, session
app.set("views",__dirname+"/views");
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(__dirname+'/public'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "2hjkeydwjfhusdifsb",
  store: new MongoStore({
    url:"mongodb://localhost:27017/socialfly",
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser= req.user;
  next();
});

//controllers
var userController = require('./controllers/user');
var homeController = require('./controllers/home');
var testController = require('./controllers/test');
//routes
app.get('/', homeController.getHome);
app.get('/signup', userController.getSignUp);
app.post('/signup', userController.postSignUp);
app.get('/:email/verify', userController.getVerify);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.getLogout);
app.get('/addCompany', userController.getAddCompany);
app.post('/addCompany', userController.postAddCompany);
//tests/interview
app.get('/test/screening/newtest', testController.getNewTest);
app.post('/test/screening/newtest', testController.postNewTest);
app.get('/test', testController.getTestInterview);
app.get('/test/screening', testController.getTestScreening);
app.get('/test/screening/:name', testController.getTest);
//testpage routes
//team
app.get('/partial/team/:id', testController.getTeam);
app.get('/partial/team/:id/addMember', testController.getAddMember);
app.post('/partial/team/:id/addMember', testController.postAddMember);
//questions
app.get('/partial/questions/:id', testController.getQuestions);
app.get('/partial/questions/:id/addQuestions', testController.getAddQuestions);
app.post('/partial/questions/:id/addQuestions', testController.postAddQuestions);
//invites
app.get('/partial/candidates/:id/invites', testController.getInvites);
app.post('/partial/candidates/:id/invites', testController.postInvites);
//add candidates
app.get('/partial/:id/:candidate', testController.getAddCandidate);
app.post('/partial/:id/:candidate', testController.postAddCandidate);
//give Tests
app.get('/partial/:id/:candidate/givetest', testController.getGiveTest);
app.post('/partial/:id/:candidate/givetest', testController.postGiveTest);
//get all candidates
app.get('/partial/candidates/:id', testController.getCandidates);
app.get('/partial/accepted/:id', testController.getAccepted);

//questions
app.get('/partial/team/addQuestions', testController.getAddQuestions);
//listen
app.listen('4000', function(){
  console.log("Server at port 4000");
});
