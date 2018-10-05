var express = require('express');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var moment = require('moment');
var url = require("url");

var accountModel = require('../models/accountModel');
var locationModel = require('../models/locationModel');
var linkServer = require('../configs/config.json');
var helper = require('../helpers/helper');
var { check } = require('express-validator/check');

var router = express.Router();

var result = {};
var objectValue = {};
//Login
router.post('/login', async (req, res) => {
    try {
        if (req.body != undefined) {
            let isEmail = false;
            if (req.body.Username.indexOf("@") > -1 && req.body.Username.indexOf(".") > -1) {
                isEmail = true;
                req.checkBody('Username', 'Sai định dạng Email').isEmail();
            } else {
                isEmail = false;
                req.checkBody('Username', 'Không để trống Username').notEmpty();
            }
            req.checkBody('Password', 'Không để trống Password').trim().notEmpty();
            req.checkBody('grant_type', 'Không để trống Grant type').trim().notEmpty();
            if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
            else {
                if (req.body.grant_type === "password") {
                    result = "";
                    result = await accountModel.postCheckInforLoginUseUsername(req.body.Username, isEmail);
                    if (result.length > 0) {
                        if (result[0].StatusAccount == 0) {
                            return res.status(200).json(helper.jsonSuccessFalse("Tài khoản chưa được active kiểm tra email hoặc thùng rác"));
                        } else if (result[0].StatusAccount == 1) {
                            if (result[0].Password == md5(req.body.Password)) {//check password
                                let resultObject = JSON.parse(JSON.stringify({
                                    "UserAccountID": result[0].UserAccountID,
                                    "UserTypeID": result[0].UserTypeID
                                }));
                                jwt.sign(resultObject, process.env.FW_SECRET, {
                                    algorithm: process.env.FW_ALGORITHM,
                                    expiresIn: '1 days'
                                }, (err, token) => {
                                    if (err) return res.status(500).json(helper.jsonError(err.message));
                                    return res.status(200).json({
                                        "success": true,
                                        "token": token,
                                        "UserAccountID": result[0].UserAccountID,
                                        "FullName": result[0].FullName,
                                        "Image": `${linkServer.hethonghotrotimviec.urlServer}${result[0].Image}`,
                                        "NameUserType": result[0].NameUserType,
                                        "UserTypeID": result[0].UserTypeID
                                    });
                                });
                            } else {
                                return res.status(400).json(
                                    helper.jsonErrorDescription("Tài khoản hoặc mật khẩu không đúng")
                                );
                            }
                        } else {
                            return res.status(400).json(
                                helper.jsonErrorDescription("Tài khoản đã bị khóa")
                            );
                        }
                    } else {
                        return res.status(400).json(
                            helper.jsonErrorDescription("Tài khoản hoặc mật khẩu không đúng")
                        );
                    }

                } else {
                    return res.status(400).json(
                        helper.jsonErrorDescription("Grant type không đúng")
                    );
                }
            };
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonError(err.message));
    }
});

//signup
router.post('/signup-for-both', [check('Username').custom(value => {
    //sử dụng express-validator để custom username không có khoảng cách
    try {
        if (value.indexOf(' ') >= 0) {
            return Promise.reject('Username không chứa khoảng cách.');
        }
        return Promise.resolve(true);
    } catch (err) {
        console.log(err.message);
        return Promise.reject('Username không để trống.');
    }
})], async (req, res) => {
    req.checkBody('Email', 'không phải là một Email').isEmail();
    req.checkBody('Password', 'Password phải chứa ít nhất là 6 ký tự').trim().isLength({ min: 6 });
    req.checkBody('Fullname', 'Fullname phải chứa ít nhất là 3 ký tự').trim().isLength({ min: 3 });
    req.checkBody('TypeAccount', 'Loại tài khoản phải là số').isInt();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let account = req.body;
            account.Password = md5(req.body.Password.trim());
            account.Fullname = req.body.Fullname.trim();
            account.CodeActive = helper.generateRandom6Number();
            if (account.TypeAccount == 2 || account.TypeAccount == 3) {
                result = "";
                result = await accountModel.postSignUpForAllUser(account);
                if (result.affectedRows > 0) {
                    let linkVerify = `${linkServer.hethonghotrotimviec.urlClientWorker}/#!/tai-khoan/verify?email=${account.Email}&code=${account.CodeActive}`;
                    helper.sendVerifyUseEmail(account.Email, account.Fullname, linkVerify)
                        .then(resultVeri => {
                            return res.status(200).json(helper.jsonSuccessTrue(`Link xác thực tài khoản đã gởi tới email: ${account.Email}, nếu không tìm thấy có thể vào thư rác để kiểm tra.`));
                        })
                        .catch(err => {
                            return res.status(500).json(helper.jsonError(err.message));
                        });
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Username hoặc Email đã tồn tại."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Loại tài khoản sai."));
            }
        } catch (err) {
            return res.status(500).json(helper.jsonError(err.message));
        }
    }
});

//profile
router.get('/profile/:useraccountid', async (req, res) => {
    try {
        await helper.jwtVerifyLogin(req.header("authorization"));//verify token trong header
        result = "";
        result = await accountModel.getProfileInform(req.params.useraccountid)//get thông tin profile
        if (result.length > 0) {
            result[0].Image = `${linkServer.hethonghotrotimviec.urlServer}${result[0].Image}`;
            return res.status(200).json(result[0]);
        }
        else {
            return res.status(404).json(helper.jsonErrorDescription("ID không tồn tại"));
        }
    } catch (err) {
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn"));
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
    req.checkBody('PersonID', 'Sai định dạng cmnd').isInt().isLength({ min: 9, max: 10 });
    req.checkBody('ProvinceID', 'Sai định dạng Tỉnh').isLength({ min: 1, max: 2 });
    req.checkBody('DistrictID', 'Sai định dạng Huyện, Thành Phố').isLength({ min: 3, max: 3 });
    req.checkBody('WardID', 'Sai định dạng Phường, Xã').isLength({ min: 5, max: 5 });
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            result = "";
            result = await helper.jwtVerifyLogin(req.header("authorization"));
            if (result.UserTypeID > 0 && result.UserTypeID < 4) {
                let profile = req.body;
                profile.UserAccountID = result.UserAccountID;
                profile.FullName = req.body.FullName.trim();
                profile.PhoneNumber = req.body.PhoneNumber.trim();
                profile.Birthday = req.body.Birthday.trim();
                profile.PersonID = req.body.PersonID.trim();
                profile.Image = url.parse(profile.Image).pathname;
                Promise.all([
                    locationModel.getProvinceByID(profile.ProvinceID),
                    locationModel.getDistrictByID(profile.DistrictID),
                    locationModel.getWardByID(profile.WardID)
                ]).then(async resultLocation => {
                    let strResult = "";
                    if (resultLocation[0][0] !== undefined) { strResult = `${strResult}${resultLocation[0][0].type} ${resultLocation[0][0].name}`; }
                    if (resultLocation[1][0] !== undefined) { strResult = `${strResult}, ${resultLocation[1][0].type} ${resultLocation[1][0].name}`; }
                    if (resultLocation[2][0] !== undefined) { strResult = `${strResult}, ${resultLocation[2][0].type} ${resultLocation[2][0].name}`; }
                    profile.PlaceName = strResult;
                    let rows = await accountModel.updateProfileInform(profile)
                    if (rows.affectedRows > 0) {
                        return res.status(200).json(helper.jsonSuccessTrue("Đã cập thật thông tin thành công"));
                    }
                    else {
                        return res.status(400).json(helper.jsonErrorDescription("Tài khoản không tồn tại"));
                    }
                })
                    .catch(err => {
                        console.log(err.message);
                        return res.status(400).json(helper.jsonErrorDescription("Lỗi khi thêm vị trí."));
                    })
            }
        } catch (err) {
            console.log(err.message);
            return res.status(400).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn"));
        }
    }
});

router.put('/verify', async (req, res) => {
    try {
        req.checkBody('Email', 'Không phải là Email').isEmail();
        req.checkBody('CodeActive', 'Password phải chứa ít nhất là 6 ký tự và nhiều nhất 7 ký tự').isInt().isLength({ min: 6, max: 6 });
        if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
        else {
            objectValue = {};
            result = {};
            objectValue = req.body;
            result = await accountModel.getVerifyByEmail(objectValue.Email)
            if (result[0].StatusAccount == 0) {
                if (result[0].CodeActive == objectValue.CodeActive) {
                    await accountModel.updateStatusAccount(objectValue, 1);
                    return res.status(200).json(helper.jsonSuccessTrue("Đã xác thực tài khoản thành công."));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Xác thực không thành công yêu cầu kiểm tra lại link."));
                }
            } else if (result[0].StatusAccount == 1) {
                return res.status(200).json(helper.jsonSuccessFalse("Tài khoản đã xác thực."));
            } else if (result[0].StatusAccount == -1) {
                return res.status(400).json(helper.jsonErrorDescription("Tài khoản đã bị khóa."));
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Sai tham số khi xác thực."));
            }
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi server khi xác nhận tài khoản."));
    }
});

module.exports = router;
