var express = require('express');
var router = express.Router();

var axiosModel = require('../../models/axiosModel');

//http method GET
router.get('/post', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 2) {
                let resultOfaAC = await axiosModel.getAxios(req.session.token, "/api/category/get-all-category");
                res.render('./cv/postCVView', {
                    tittle: "Đăng hồ sơ | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    categories: resultOfaAC.data,
                    slideBarSTT: 3
                });
            } else { res.redirect('/'); }
        } catch (error) {
            console.log(error);
            if (error.response.data.error == 'invalid_grant') {
                res.status(400).json(error.response.data.error_description);
            } else { res.status(500).json(error && error.message ? error.message : error); }
        }
    } else { res.redirect('/login'); }
});
//get all cv not actived
router.get('/worker-category-not-activated', async (req, res) => {
    if (req.session.token) {
        try {
            if (req.session.account.UserTypeID == 1) {
                let resultgACV = await axiosModel.getAxios(req.session.token, "/api/cv");
                res.render('./cv/workerCVNotActive', {
                    tittle: "Danh sách người làm chưa được kính hoạt | Hệ thống hỗ trợ tìm việc",
                    userAccount: req.session.account,
                    userCategories: resultgACV.data,
                    slideBarSTT: 4
                });
            }
        } catch (errJWT) {
            console.log(errJWT.message);
            if (errJWT.response.data.error == 'invalid_grant') { res.status(400).json(errJWT.response.data.error_description); }
            else { res.status(500).json(errJWT); }
        };
    } else { res.redirect('/login'); }
});
//http method POST 
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
                await axiosModel.postAxios(req.session.token, cv, "/api/cv");
                res.status(200).json(true);
            } else {
                throw "Loại tài khoản của bạn không có quyền đăng hồ sơ";
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
    } else { res.redirect('/login'); }
});
//http method PUT
router.put('/worker-category-not-activated', async (req, res) => {
    try {
        let cvMD = {
            categoryid: req.body.categoryid.trim(),
            userworkerid: req.body.userworkerid.trim()
        };
        await axiosModel.putAxios(req.session.token, cvMD, "/api/cv");
        res.status(200).json(true);
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
});
//http method DELETE
router.delete('/worker-category-not-activated', async (req, res) => {
    try {
        let cvMD = {
            categoryid: req.body.categoryid.trim(),
            userworkerid: req.body.userworkerid.trim()
        };
        await axiosModel.deleteAxios(req.session.token, cvMD, "/api/cv");
        res.status(200).json(true);
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
});
module.exports = router;