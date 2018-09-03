var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
require("dotenv").config({ path: '../configs/.env' });

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(cookieParser(process.env.FWF_SECRETSESSION));
app.use(session({
  secret: process.env.FWF_SECRETSESSION,
  resave: false,
  saveUninitialized: true
}));

var loginRouter = require('./routes/account/loginRouter');
var logoutRouter = require('./routes/account/logoutRouter');
var signupRouter = require('./routes/account/signupRouter');
var profileRouter = require('./routes/profile/profileRouter');
//
var indexAdminRouter = require('./routes/adminRouter/indexRouter');
var cvAdminRouter = require('./routes/adminRouter/cv/cvRouter');
//
var indexWorkerRouter = require('./routes/workerRouter/indexRouter');
var cvWorkerRouter = require('./routes/workerRouter/cv/cvRouter');

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/trang-ca-nhan', profileRouter);
app.use('/admin', indexAdminRouter);
app.use('/admin/cv', cvAdminRouter);
app.use('/', indexWorkerRouter);
app.use('/cv', cvWorkerRouter);

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
