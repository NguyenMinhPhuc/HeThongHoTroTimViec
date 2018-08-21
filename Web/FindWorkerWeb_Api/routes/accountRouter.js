var express = require('express');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var moment = require('moment');

var accountModel = require('../models/accountModel');
//var config = require('../configs/config.json').jsonwebtoken;
var helper = require('../helpers/helper');
var { check } = require('express-validator/check');

var router = express.Router();
//GET
router.get('/profile', (req, res) => {
    helper.jwtVerifyLogin(req.header("authorization"))//verify token trong header
        .then(results => {
            accountModel.getProfileInform(results.UserAccountID)//get thông tin profile
                .then(result => {
                    if (result.length > 0) {
                        return res.json(200, result[0]);
                    } else {
                        return res.json(400, {
                            "error": "invalid_grant",
                            "error_description": "ID không tồn tại"
                        });
                    }
                })
                .catch(err => {
                    return res.json(500, err);
                });
        })
        .catch(err => {
            console.log(err);
            return res.json(400, {
                "error": "invalid_grant",
                "error_description": "Token không tồn tại hoặc đã hết hạn"
            });
        });
});
router.get('/profile/:useraccountid', (req, res) => {
    helper.jwtVerifyLogin(req.header("authorization"))//verify token trong header
        .then(results => {
            accountModel.getProfileInform(req.params.useraccountid)//get thông tin profile
                .then(result => {
                    if (result.length > 0) {
                        return res.json(200, result[0]);
                    } else {
                        return res.json(400, {
                            "error": "invalid_grant",
                            "error_description": "ID không tồn tại"
                        });
                    }
                })
                .catch(err => {
                    return res.json(500, err);
                });
        })
        .catch(err => {
            console.log(err);
            return res.json(400, {
                "error": "invalid_grant",
                "error_description": "Token không tồn tại hoặc đã hết hạn"
            });
        });
});

//POST
router.post('/login', [check('username').custom(value => {//sử dụng express-validator để custom username không có khoảng cách
    if (value.indexOf(' ') >= 0) {
        return Promise.reject('Username không chứa khoảng cách');
    } return Promise.resolve(true);
})], (req, res) => {
    req.checkBody('username', 'Không để trống Username').trim().notEmpty();
    req.checkBody('password', 'Không để trống Password').trim().notEmpty();
    req.checkBody('grant_type', 'Không để trống Grant type').trim().notEmpty();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        if (req.body.grant_type === "password") {
            let user = {
                username: req.body.username.trim(),
                password: md5(req.body.password.trim())
            };
            accountModel.postCheckInforLogin(user)//Select and check user and password
                .then(result => {
                    if (result.length > 0) {
                        // var resultObject = JSON.parse(JSON.stringify(result[0].UserAccountID, result[0].UserTypeID));//ép chuỗi
                        var resultObject = JSON.parse(JSON.stringify({ "UserAccountID": result[0].UserAccountID, "UserTypeID": result[0].UserTypeID }));
                        jwt.sign(resultObject, process.env.FW_SECRET, { algorithm: process.env.FW_ALGORITHM, expiresIn: '1d' }, (err, token) => {
                            if (err) return res.json(500, { error: err });
                            return res.json(200, { "success": true, "token": token, "FullName": result[0].FullName, "Image": result[0].Image, "UserTypeID": result[0].UserTypeID });
                        });
                    } else {
                        return res.json(400, {
                            "error": "invalid_grant",
                            "error_description": "Username hoặc Password là không đúng"
                        });
                    }
                })
                .catch(err => {
                    return res.json(500, err);
                });
        } else {
            return res.json(400, {
                "error": "invalid_grant",
                "error_description": "Grant type không đúng"
            });
        }
    };
});
router.post('/signup_for_guest', [check('username').custom(value => {//sử dụng express-validator để custom username không có khoảng cách
    if (value.indexOf(' ') >= 0) {
        return Promise.reject('Username không chứa khoảng cách');
    }
    return Promise.resolve(true);
})],
    (req, res) => {
        req.checkBody('email', 'không phải là một Email').isEmail();
        req.checkBody('password', 'Password phải chứa ít nhất là 6 ký tự').trim().isLength({ min: 6 });
        req.checkBody('fullname', 'Fullname phải chứa ít nhất là 3 ký tự').trim().isLength({ min: 3 });
        if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
        else {
            let account = {
                email: req.body.email.trim(),
                username: req.body.username.trim(),
                password: md5(req.body.password.trim()),
                fullname: req.body.fullname.trim()
            };
            accountModel.postSignUpForAllUser(account, 3)
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
                    return res.json(500, { "error": err });
                });
        }
    });
router.post('/signup_for_worker', [check('username').custom(value => {//sử dụng express-validator để custom username không có khoảng cách
    if (value.indexOf(' ') >= 0) {
        return Promise.reject('Username không chứa khoảng cách');
    }
    return Promise.resolve(true);
})],
    (req, res) => {
        req.checkBody('email', 'Không phải là Email').isEmail();
        req.checkBody('password', 'Password phải chứa ít nhất là 6 ký tự').trim().isLength({ min: 6 });
        req.checkBody('fullname', 'Fullname phải chứa ít nhất là 3 ký tự').trim().isLength({ min: 3 });
        if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
        else {
            let account = {
                email: req.body.email.trim(),
                username: req.body.username.trim(),
                password: md5(req.body.password.trim()),
                fullname: req.body.fullname.trim()
            };
            accountModel.postSignUpForAllUser(account, 2)
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
                    return res.json(500, { "error": err });
                });
        }
    });

//PUT
router.put('/profile', [check('birthday').custom(value => {//sử dụng express-validator để custom date đúng định dạng
    if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
        return Promise.reject('Không đúng định dạng ngày dd/mm/yyyy');
    }
    return Promise.resolve(true);
})],
    (req, res) => {
        req.checkBody('fullname', 'Không để trống họ tên').trim().notEmpty();
        req.checkBody('phonenumber', 'Không phải là số điện thoại').isMobilePhone("vi-VN");
        req.checkBody('ismale', 'Sai định dạng true false').isBoolean();
        req.checkBody('place', 'Không để trống địa điểm').trim().notEmpty();
        //req.checkBody('image', 'Không để trống ảnh').trim().isURL();
        req.checkBody('personid', 'Sai định dạng cmnd').trim().isInt().isLength({ min: 9, max: 10 });
        if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
        else {
            helper.jwtVerifyLogin(req.header("authorization"))
                .then(result => {
                    let profile = {
                        useraccountid: result.UserAccountID,
                        fullname: req.body.fullname.trim(),
                        ismale: req.body.ismale,
                        phonenumber: req.body.phonenumber.trim(),
                        place: req.body.place.trim(),
                        birthday: req.body.birthday.trim(),
                        image: req.body.image.trim(),
                        personid: req.body.personid.trim()
                    };
                    accountModel.updateProfileInform(profile)
                        .then(rows => {
                            if (rows.affectedRows > 0) {
                                return res.json(200, { "success": true });
                            }
                            return res.json(400, {
                                "error": "invalid_grant",
                                "error_description": "Account ID không tồn tại"
                            });
                        })
                        .catch(err => {
                            return res.json(500, { "error": err });
                        });
                })
                .catch(err => {
                    console.log(err);
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Token không tồn tại hoặc đã hết hạn"
                    });
                });
        };
    });
//isLatLong check if the string is a valid latitude-longitude coordinate in the format lat,long or lat, long.
module.exports = router;
