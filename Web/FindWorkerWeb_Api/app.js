var createError = require('http-errors');
var express = require('express');
//var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
require("dotenv").config({path: '../configs/.env'});//vì mặc định .env sẽ chạy cùng với lệnh node server.js nên sẽ nằm trong thư mục binPort

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

var accountRouter = require('./routes/accountRouter'),
  cvRouter = require('./routes/curriculumVitaeRouter');
app.use('/api/account', accountRouter);
app.use('/api/cv', cvRouter);

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);
  console.log(err.message);
});

module.exports = app;
