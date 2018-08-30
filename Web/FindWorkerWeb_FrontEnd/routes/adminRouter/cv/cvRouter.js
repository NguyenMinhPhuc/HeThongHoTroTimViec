var express = require('express');
var router = express.Router();

var axiosModel = require('../../../models/axiosModel');

//get all cv not activated
router.get('/worker-category-not-activated', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1) {
                let resultgACV = await axiosModel.getAxios(req.session.token, "/api/cv/not-activated");
                res.render('./adminViews/cv/workerCVNotActive', {
                    tittle: "Danh sách người làm chưa được kính hoạt | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    userCategories: resultgACV.data.result,
                    slideBarSTT: 4
                });
            } else { res.redirect('/logout'); }
        } catch (errJWT) {
            console.log(errJWT.message);
            res.redirect('/logout');
        };
    } else { res.redirect('/logout'); }
});
//http method PUT - active a cv
router.put('/worker-category-not-activated', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1) {
                let cvMD = {
                    categoryid: req.body.categoryid.trim(),
                    userworkerid: req.body.userworkerid.trim()
                };
                await axiosModel.putAxios(req.session.token, cvMD, "/api/cv/active-cv");
                res.status(200).json(true);
            } else { res.redirect('/logout'); }
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
//http method DELETE - delete a cv
router.delete('/worker-category-not-activated', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1) {
                let cvMD = {
                    categoryid: req.body.categoryid.trim(),
                    userworkerid: req.body.userworkerid.trim()
                };
                await axiosModel.deleteAxios(req.session.token, cvMD, "/api/cv/active-cv");
                res.status(200).json(true);
            } else { res.redirect('/logout'); }
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