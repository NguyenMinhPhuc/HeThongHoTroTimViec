var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
require("dotenv").config({ path: '../configs/.env' });//vì mặc định .env sẽ chạy cùng với lệnh node server.js nên sẽ nằm trong thư mục binPort

var app = express();

app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
//

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

var accountRouter = require('./routers/accountRouter');
var cvRouter = require('./routers/cvRouter');
var categoryRouter = require('./routers/categoryRouter');
var locationRouter = require('./routers/locationRouter');

app.use('/api/account', accountRouter);
app.use('/api/cv', cvRouter);
app.use('/api/category', categoryRouter);
app.use('/api/location', locationRouter);

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
