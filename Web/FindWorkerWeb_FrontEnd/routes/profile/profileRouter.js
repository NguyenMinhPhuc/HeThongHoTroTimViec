var express = require('express');
var router = express.Router();

var axiosModel = require('../../models/axiosModel');

//http method GET
router.get('/:useraccountid', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1 || req.session.account.UserTypeID == 2) {
                let resultgAP = await axiosModel.getAxios(req.session.token, "/api/account/profile/".concat(req.params.useraccountid));
                res.render('./profile/profileView', {
                    tittle: "Trang cá nhân | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    myProfile: resultgAP.data,
                    slideBarSTT: 0
                });
            } else { res.redirect('/login'); }
        } catch (error) {
            if (error.response.data.error == 'invalid_grant') {
                res.locals.message = error.response.data.error_description;
                res.locals.error = req.app.get('env') === 'development' ? error : {};
                res.status(error.status || 404);
                res.render('error');
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    } else { res.redirect('/login'); }
});
router.get('/edit/:useraccountid', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserAccountID == req.params.useraccountid && (req.session.account.UserTypeID == 1 || req.session.account.UserTypeID == 2)) {
                let resultgAP = await axiosModel.getAxios(req.session.token, "/api/account/profile/".concat(req.params.useraccountid));
                res.render('./profile/profileEditView', {
                    tittle: "Trang cá nhân | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    myProfile: resultgAP.data,
                    slideBarSTT: 0
                });
            } else { res.redirect('/'); }
        } catch (error) {
            if (error.response.data.error == 'invalid_grant') { res.status(400).json(error.response.data.error_description); }
            else {
                console.log("error: " + error.message);
                res.status(500).json(error);
            }
        }
    } else { res.redirect('/login'); }
});

//http method PUT
router.put('/edit/:useraccountid', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserAccountID == req.params.useraccountid && (req.session.account.UserTypeID == 1 || req.session.account.UserTypeID == 2)) {
                let profileEdit = {
                    fullname: req.body.Fullname,
                    phonenumber: req.body.PhoneNumber,
                    ismale: req.body.IsMale,
                    place: req.body.Place,
                    personid: req.body.PersonID,
                    birthday: req.body.Birthday,
                    image: req.body.Image
                };
                await axiosModel.putAxios(req.session.token, profileEdit, "/api/account/profile");
                res.status(200).json("/profile")
            } else { res.redirect('/'); }
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
    } else { res.redirect('/login'); }
});

module.exports = router;