var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var logger = require('morgan');
var session = require('express-session');
require("dotenv").config({ path: '../configs/.env' });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.FWF_SECRETSESSION,
  resave: false,
  saveUninitialized: true
}));

var loginRouter = require('./routes/account/loginRouter'),
  logoutRouter = require('./routes/account/logoutRouter'),
  signupRouter = require('./routes/account/signupRouter'),
  indexRouter = require('./routes/indexRouter'),
  profileRouter = require('./routes/profile/profileRouter'),
  cvRouter = require('./routes/cv/cvRouter');

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/cv', cvRouter);

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error');
});

module.exports = app;
