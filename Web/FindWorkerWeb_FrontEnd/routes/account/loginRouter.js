var express = require('express');
var router = express.Router();

var axiosModel = require('../../models/axiosModel');

//http method GET
router.get('/', (req, res, next) => {
    if (req.session.account) {
        if (req.session.account.UserTypeID == 1) {
            res.redirect("/admin");
        } else if (req.session.account.UserTypeID == 2) {
            res.redirect("/");
        } else { res.redirect("/logout"); }
    } else { res.render('./account/loginView'); }
});

//http method POST
router.post('/', async (req, res) => {
    if (req.body.grant_type === "password") {
        try {
            let user = {
                username: req.body.username,
                password: req.body.password,
                grant_type: req.body.grant_type
            };
            let resultAAM = await axiosModel.postAxios(null, user, "/api/account/login");
            if (resultAAM.data.UserTypeID == 1 || resultAAM.data.UserTypeID == 2) {
                req.session.token = resultAAM.data.token;
                req.session.account = {
                    UserAccountID: resultAAM.data.UserAccountID,
                    FullName: resultAAM.data.FullName,
                    Image: resultAAM.data.Image,
                    UserTypeID: resultAAM.data.UserTypeID
                };
                if (resultAAM.data.UserTypeID == 1) {
                    res.status(200).json("/admin");
                } else {
                    res.status(200).json("/");
                }
            } else {
                res.status(403).json("Tài khoản bạn là khách không có quyền đăng nhập ở đây");
            }
        } catch (error) {
            if (error.response.data.error[0].msg) {
                res.status(400).json(error.response.data.error[0].msg);
            } else if (error.response.data.error == 'invalid_grant') {
                res.status(400).json(error.response.data.error_description);
            } else {
                console.log(error.message);
                res.status(500).json(error);
            }
        }
    } else {
        return res.status(401).json("Grant type không đúng");
    }
});

module.exports = router;