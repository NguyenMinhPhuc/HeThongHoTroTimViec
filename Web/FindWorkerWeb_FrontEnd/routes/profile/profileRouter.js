var express = require('express');
var router = express.Router();

var axiosModel = require('../../models/axiosModel');

//http method GET profile by id
router.get('/:useraccountid', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1) {
                let resultProfile = await axiosModel.getAxios(req.session.token, "/api/account/profile/".concat(req.params.useraccountid));
                let resultActivated = await axiosModel.getAxios(req.session.token, "/api/cv/activated/".concat(req.params.useraccountid));
                res.render('./adminViews/profile/profileView', {
                    tittle: "Trang cá nhân | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    myProfile: resultProfile.data,
                    myCV: resultActivated.data,
                    slideBarSTT: 0
                });
            } else if (req.session.account.UserTypeID == 2) {
                let resultProfile = await axiosModel.getAxios(req.session.token, "/api/account/profile/".concat(req.params.useraccountid));
                let resultActivated = await axiosModel.getAxios(req.session.token, "/api/cv/activated/".concat(req.params.useraccountid));
                res.render('./workerViews/profile/profileView', {
                    tittle: "Trang cá nhân | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    myProfile: resultProfile.data,
                    myCV: resultActivated.data,
                    slideBarSTT: 0
                });
            } else { res.redirect('/logout'); }
        } catch (error) {
            if (error.response.data.error == 'invalid_grant') {
                res.locals.message = error.response.data.error_description;
                res.locals.error = req.app.get('env') === 'development' ? error : {};
                res.status(error.status || 404);
                res.render('error');
            }
            else {
                console.log(error.message);
                res.redirect('/logout');
            }
        }
    } else { res.redirect('/logout'); }
});

//http method GET profile by id to edit
router.get('/edit', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1) {
                let resultgAP = await axiosModel.getAxios(req.session.token, "/api/account/profile/".concat(req.session.account.UserAccountID));
                res.render('./adminViews/profile/profileEditView', {
                    tittle: "Trang cá nhân | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    myProfile: resultgAP.data,
                    slideBarSTT: 0
                });
            } else if (req.session.account.UserTypeID == 2) {
                let resultgAP = await axiosModel.getAxios(req.session.token, "/api/account/profile/".concat(req.session.account.UserAccountID));
                res.render('./workerViews/profile/profileView', {
                    tittle: "Trang cá nhân | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    myProfile: resultgAP.data,
                    slideBarSTT: 0
                });
            } else { res.redirect('/logout'); }
        } catch (error) {
            res.redirect('/logout');
            if (error.response.data.error == 'invalid_grant') {
                res.redirect('/logout');
                res.status(400).json(error.response.data.error_description);
            }
            else {
                console.log("error: " + error.message);
                res.redirect('/logout');
            }
        }
    } else { res.redirect('/logout'); }
});

//http method PUT a profile edited
router.put('/edit', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1 || req.session.account.UserTypeID == 2) {
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
    } else { res.redirect('/logout'); }
});

module.exports = router;