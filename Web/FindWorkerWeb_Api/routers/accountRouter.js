var express = require('express');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var moment = require('moment');

var accountModel = require('../models/accountModel');
var linkServer = require('../configs/config.json');
var helper = require('../helpers/helper');
var { check } = require('express-validator/check');

var router = express.Router();

var result = {};
var objectValue = {};
//Login
router.post('/login', async (req, res) => {
    let isEmail = false;
    if (req.body.username.indexOf("@") > -1 && req.body.username.indexOf(".") > -1) {
        isEmail = true;
        req.checkBody('username', 'Sai định dạng Email').isEmail();
    } else {
        isEmail = false;
        req.checkBody('username', 'Không để trống Username').notEmpty();
    }
    req.checkBody('password', 'Không để trống Password').trim().notEmpty();
    req.checkBody('grant_type', 'Không để trống Grant type').trim().notEmpty();
    if (req.validationErrors()) return res.status(400).json({ "error": req.validationErrors() });
    else {
        if (req.body.grant_type === "password") {
            try {
                result = "";
                result = await accountModel.postCheckInforLoginUseUsername(req.body.username, isEmail);
                if (result.length > 0) {
                    if (result[0].StatusAccount == 0) {
                        return res.status(200).json({
                            "success": false,
                            "message": "Tài khoản chưa được active kiểm tra email hoặc thùng rác"
                        });
                    } else if (result[0].StatusAccount == 1) {
                        if (result[0].Password == md5(req.body.password)) {//check password
                            let resultObject = JSON.parse(JSON.stringify({
                                "UserAccountID": result[0].UserAccountID,
                                "UserTypeID": result[0].UserTypeID
                            }));
                            jwt.sign(resultObject, process.env.FW_SECRET, {
                                algorithm: process.env.FW_ALGORITHM,
                                expiresIn: '1 days'
                            }, (err, token) => {
                                if (err) return res.status(500).json({ error: err });
                                return res.status(200).json({
                                    "success": true,
                                    "token": token,
                                    "UserAccountID": result[0].UserAccountID,
                                    "FullName": result[0].FullName,
                                    "Image": result[0].Image,
                                    "NameUserType": result[0].NameUserType,
                                    "UserTypeID": result[0].UserTypeID
                                });
                            });
                        } else {
                            return res.status(400).json({
                                "error": "invalid_grant",
                                "error_description": "Tài khoản hoặc mật khẩu không đúng"
                            });
                        }
                    } else {
                        return res.status(400).json({
                            "error": "invalid_grant",
                            "error_description": "Tài khoản đã bị khóa"
                        });
                    }

                } else {
                    return res.status(400).json({
                        "error": "invalid_grant",
                        "error_description": "Tài khoản hoặc mật khẩu không đúng"
                    });
                }
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(400).json({
                "error": "invalid_grant",
                "error_description": "Grant type không đúng"
            });
        }
    };
});

//signup
router.post('/signup-for-both', [check('username').custom(value => {
    //sử dụng express-validator để custom username không có khoảng cách
    if (value.indexOf(' ') >= 0) {
        return Promise.reject('Username không chứa khoảng cách');
    }
    return Promise.resolve(true);
})], async (req, res) => {
    req.checkBody('email', 'không phải là một Email').isEmail();
    req.checkBody('password', 'Password phải chứa ít nhất là 6 ký tự').trim().isLength({ min: 6 });
    req.checkBody('fullname', 'Fullname phải chứa ít nhất là 3 ký tự').trim().isLength({ min: 3 });
    req.checkBody('typeaccount', 'Loại tài khoản phải là số').isInt();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        let account = {
            email: req.body.email,
            username: req.body.username,
            password: md5(req.body.password.trim()),
            fullname: req.body.fullname.trim(),
            codeActive: helper.generateRandom6Number()
        };
        try {
            if (req.body.typeaccount == 2 || req.body.typeaccount == 3) {
                result = "";
                result = await accountModel.postSignUpForAllUser(account, req.body.typeaccount);
                if (result.affectedRows > 0) {
                    let linkVerify = `${linkServer.hethonghotrotimviec.urlServer}/#!/tai-khoan/verify?email=${account.email}&code=${account.codeActive}`;
                    helper.sendVerifyUseEmail(account.email, account.fullname, linkVerify)
                        .then(resultVeri => {
                            return res.status(200).json({ "success": true, "message": `Link xác thực tài khoản đã gởi tới email: ${account.email}, nếu không tìm thấy có thể vào thư rác để kiểm tra.` });
                        })
                        .catch(err => {
                            return res.status(500).json({ "error": err });
                        });
                } else {
                    return res.status(400).json({
                        "error": "invalid_grant",
                        "error_description": "Username hoặc Email đã tồn tại."
                    });
                }
            } else {
                return res.status(400).json({
                    "error": "invalid_grant",
                    "error_description": "Loại tài khoản sai."
                });
            }
        } catch (err) {
            return res.status(500).json({ "error": err });
        }
    }
});

//profile
router.get('/profile/:useraccountid', async (req, res) => {
    try {
        await helper.jwtVerifyLogin(req.header("authorization"));//verify token trong header
        result = "";
        result = await accountModel.getProfileInform(req.params.useraccountid)//get thông tin profile
        if (result.length > 0) { return res.json(200, result[0]); }
        else {
            return res.status(404).json({
                "error": "invalid_grant",
                "error_description": "ID không tồn tại"
            });
        }
    } catch (err) {
        return res.status(500).json({
            "error": "invalid_grant",
            "error_description": "Token không tồn tại hoặc đã hết hạn"
        });
    }
});
//PUT
router.put('/profile', [check('Birthday').custom(value => {//sử dụng express-validator để custom date đúng định dạng
    if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
        return Promise.reject('Không đúng định dạng ngày dd/mm/yyyy');
    }
    return Promise.resolve(true);
})], async (req, res) => {
    req.checkBody('FullName', 'Không để trống họ tên').trim().notEmpty();
    req.checkBody('PhoneNumber', 'Không phải là số điện thoại').isMobilePhone("vi-VN");
    req.checkBody('IsMale', 'Sai định dạng true false').isBoolean();
    req.checkBody('Image', 'Không để trống ảnh').trim().isURL();
    req.checkBody('PersonID', 'Sai định dạng cmnd').isInt().isLength({ min: 9, max: 10 });
    req.checkBody('ProvinceID', 'Sai định dạng Tỉnh').isInt().isLength({ min: 1, max: 2 });
    req.checkBody('DistrictID', 'Sai định dạng Huyện, Thành Phố').isInt().isLength({ min: 1, max: 3 });
    req.checkBody('WardID', 'Sai định dạng Phường, Xã').isInt().isLength({ min: 1, max: 5 });
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        try {
            result = "";
            result = await helper.jwtVerifyLogin(req.header("authorization"));
            let profile = {
                useraccountid: result.UserAccountID,
                fullname: req.body.FullName.trim(),
                ismale: req.body.IsMale,
                phonenumber: req.body.PhoneNumber.trim(),
                birthday: req.body.Birthday.trim(),
                image: req.body.Image.trim(),
                provinceid: req.body.ProvinceID,
                districtid: req.body.DistrictID,
                wardid: req.body.WardID,
                streetname: req.body.StreetName,
                personid: req.body.PersonID.trim()
            };
            let rows = await accountModel.updateProfileInform(profile)
            if (rows.affectedRows > 0) {
                return res.status(200).json({ "success": true, "message": "Đã cập thật thông tin thành công" });
            }
            else {
                return res.status(400).json({
                    "error": "invalid_grant",
                    "error_description": "Tài khoản không tồn tại"
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                "error": "invalid_grant",
                "error_description": "Token không tồn tại hoặc đã hết hạn"
            });
        }
    }
});

router.put('/verify', async (req, res) => {
    try {
        req.checkBody('email', 'Không phải là Email').isEmail();
        req.checkBody('codeactive', 'Password phải chứa ít nhất là 6 ký tự và nhiều nhất 7 ký tự').isInt().isLength({ min: 6, max: 6 });
        if (req.validationErrors()) { return res.status(400).json({ "error": req.validationErrors() }); }
        else {
            objectValue = {};
            result = {};
            objectValue = {
                email: req.body.email,
                codeactive: req.body.codeactive
            };
            result = await accountModel.getVerifyByEmail(objectValue.email)
            if (result[0].StatusAccount == 0) {
                if (result[0].CodeActive == objectValue.codeactive) {
                    await accountModel.updateStatusAccount(objectValue, 1);
                    return res.status(200).json({
                        "success": true,
                        "message": "Đã xác thực tài khoản thành công."
                    });
                } else {
                    return res.status(400).json({
                        "error": "invalid_grant",
                        "error_description": "Xác thực không thành công yêu cầu kiểm tra lại link."
                    });
                }
            } else if (result[0].StatusAccount == 1) {
                return res.status(200).json({
                    "success": false,
                    "message": "Tài khoản đã xác thực trước đó."
                });
            } else if (result[0].StatusAccount == -1) {
                return res.status(400).json({
                    "success": true,
                    "message": "Tài khoản đã bị khóa."
                });
            } else {
                return res.status(400).json({
                    "success": true,
                    "message": "Tài khoản bị sai tham số khi xác thực."
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            "error": "invalid_grant",
            "error_description": "Lỗi server khi xác nhận tài khoản."
        });
    }
});

module.exports = router;
