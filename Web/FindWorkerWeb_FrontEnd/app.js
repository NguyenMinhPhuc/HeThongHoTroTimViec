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

var loginRouter = require('./routes/account/loginRouter'),
  logoutRouter = require('./routes/account/logoutRouter'),
  signupRouter = require('./routes/account/signupRouter'),
  profileRouter = require('./routes/profile/profileRouter'),
  //
  indexAdminRouter = require('./routes/adminRouter/indexRouter'),
  cvAdminRouter = require('./routes/adminRouter/cv/cvRouter'),
  //
  indexWorkerRouter = require('./routes/workerRouter/indexRouter'),
  cvWorkerRouter = require('./routes/workerRouter/cv/cvRouter');

app.use('/login', loginRouter)
  .use('/logout', logoutRouter)
  .use('/signup', signupRouter)
  .use('/profile', profileRouter)
  .use('/admin', indexAdminRouter)
  .use('/admin/cv', cvAdminRouter)
  .use('/', indexWorkerRouter)
  .use('/cv', cvWorkerRouter)

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
