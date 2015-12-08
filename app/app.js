var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var passportConf = require('./config/passport');
var MongoStore = require('connect-mongo')(session);

var app = express();

//mongoose connection
mongoose.connect("mongodb://localhost:27017/interviewer");
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
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.getLogout);
app.get('/addCompany', userController.getAddCompany);
app.post('/addCompany', userController.postAddCompany);
//tests/interview
app.get('/test/screening/newtest', userController.getNewTest);
app.post('/test/screening/newtest', userController.postNewTest);
app.get('/test', userController.getTest);
app.get('/test/screening', userController.getTestScreening);
app.get('/test/screening/:name', userController.getTest);
//testpage routes
app.get('/partial/team', testController.getTeam);
app.get('/partial/questions', testController.getQuestions);
app.get('/partial/candidates', testController.getCandidates);
app.get('/partial/accepted', testController.getAccepted);
//listen
app.listen('3000', function(){
  console.log("Server at port 3000");
});
