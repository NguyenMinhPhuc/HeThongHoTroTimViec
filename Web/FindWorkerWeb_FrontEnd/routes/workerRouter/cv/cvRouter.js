var express = require('express');
var router = express.Router();

var axiosModel = require('../../../models/axiosModel');

//http method GET all category
router.get('/post', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 2) {
                let resultOfaAC = await axiosModel.getAxios(req.session.token, "/api/category/get-all");
                res.render('./workerViews/cv/postCVView', {
                    tittle: "Đăng hồ sơ | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    categories: resultOfaAC.data,
                    slideBarSTT: 3
                });
            } else { res.redirect('/logout'); }
        } catch (error) {
            console.log(errJWT.message);
            res.redirect('/logout');
        }
    } else { res.redirect('/logout'); }
});
//http method POST a CV
router.post('/post', async (req, res) => {
    let cv = {};
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 2) {
                cv.categoryid = req.body.categoryid.trim();
                cv.namejobcategory = req.body.namejobcategory.trim();
                cv.exprience = req.body.exprience.trim();
                cv.qualifications = req.body.qualifications.trim();
                cv.generalinformation = req.body.generalinformation.trim();
                cv.imagestore = req.body.imagestore.trim();
                await axiosModel.postAxios(req.session.token, cv, "/api/cv/post");
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