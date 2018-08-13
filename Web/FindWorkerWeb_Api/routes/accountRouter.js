var express = require('express');
var jwt = require('jsonwebtoken');
var md5 = require('md5');

var model_login = require('../models/accountModel');
var config = require('../configs/config.json').jsonwebtoken;

var router = express.Router();

router.post('/login', function (req, res) {
    req.checkBody('username', 'Không để trống Username').notEmpty();
    req.checkBody('password', 'Không để trống Password').notEmpty();
    req.checkBody('grant_type', 'Không để trống Grant type').notEmpty();
    var errors = req.validationErrors();
    if (errors) res.json(400, { "error": errors });
    else {
        let user = {
            username: req.body.username.trim(),
            password: md5(req.body.password.trim())
            //grant_type: req.body.grant_type
        };
        model_login.postCheckInforLogin(user)
            .then(result => {
                if (result.length > 0) {
                    var resultObject = JSON.parse(JSON.stringify(result[0]));//ép chuỗi
                    jwt.sign(resultObject, config.secret, { algorithm: config.algorithm, expiresIn: '1d' }, (err, token) => {//mã hóa sử dụng jwt
                        if (err) return res.json(500, { error: err });
                        return res.json(200, { "success": true, "token": token, "UserTypeID": result[0].UserTypeID });
                    });
                } else return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Username hoặc Password là không đúng"
                });
            })
            .catch(err => {
                res.json(500, err);
            })
    };
});

router.post('/signup_for_guest', (req, res) => {
    req.checkBody('email', 'Không để trống Email').notEmpty();
    req.checkBody('email', 'Email phải là một Email').isEmail();
    req.checkBody('username', 'Không để trống Username').notEmpty();
    req.checkBody('password', 'Password phải chứa ít nhất là 6 ký tự').isLength({ min: 6 });
    req.checkBody('fullname', 'Fullname phải chứa ít nhất là 3 ký tự').isLength({ min: 3 });
    var errors = req.validationErrors();
    if (errors) res.json(400, { "error": errors });
    else {
        let account = {
            email: req.body.email.trim(),
            username: req.body.username.trim(),
            password: md5(req.body.password.trim()),
            fullname: req.body.fullname.trim()
        };
        model_login.postSignUpForAllUser(account, 3)
            .then(result => {
                if (result.affectedRows > 0) {//kiểm tra số dòng đã insert thành công
                    return res.json(200, { "success": true });
                }
                return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Username hoặc Email đã tồn tại"
                });
            })
            .catch(err => {
                res.json(500, { "error": err });
            })
    }
});

router.post('/signup_for_worker', (req, res) => {
    req.checkBody('email', 'Không để trống Email').notEmpty();
    req.checkBody('email', 'Email phải là một Email').isEmail();
    req.checkBody('username', 'Không để trống Username').notEmpty();
    req.checkBody('password', 'Password phải chứa ít nhất là 6 ký tự').isLength({ min: 6 });
    req.checkBody('fullname', 'Fullname phải chứa ít nhất là 3 ký tự').isLength({ min: 3 });
    var errors = req.validationErrors();
    if (errors) res.json(400, { "error": errors });
    else {
        let account = {
            email: req.body.email.trim(),
            username: req.body.username.trim(),
            password: md5(req.body.password.trim()),
            fullname: req.body.fullname.trim()
        };
        model_login.postSignUpForAllUser(account, 2)
            .then(result => {
                if (result.affectedRows > 0) {//kiểm tra số dòng đã insert thành công
                    return res.json(200, { "success": true });
                }
                return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Username hoặc Email đã tồn tại"
                });
            })
            .catch(err => {
                res.json(500, { "error": err });
            })
    }
});

module.exports = router;
