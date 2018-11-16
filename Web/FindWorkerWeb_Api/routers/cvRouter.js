const express = require('express');
const router = express.Router();

const cvModel = require('../models/cvModel');
const helper = require('../helpers/helper');
const CVScript = require('../databases/app_data/curriculumVitaeScript.json');
const linkServer = require('../configs/config.json');

//router post
//POST đăng hồ sơ để đợi duyệt
router.post('/post', async (req, res) => {
    req.checkBody('CategoryID', 'Danh mục bị lỗi').isInt();
    req.checkBody('Exprience', 'Sai định dạng kiểu dữ liệu của năm kinh nghiệm').isFloat({ min: 0.0 });
    req.checkBody('Qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('GeneralInformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let results = await helper.jwtVerifyLogin(req.header("authorization"));
            if (results.UserTypeID == 2) {
                let objectValue = req.body;
                objectValue.UserAccountID = results.UserAccountID;
                objectValue.Qualifications = objectValue.Qualifications.trim();
                objectValue.GeneralInformation = objectValue.GeneralInformation.trim();
                let resultpJCBCID = await cvModel.postJobCategoryByCategoryID(objectValue);
                if (resultpJCBCID.affectedRows > 0) { return res.status(200).json(helper.jsonSuccessTrue("Đã đăng hồ sơ thành công.")); }
                return res.status(400).json(helper.jsonErrorDescription("Thông tin hồ sơ bị trùng."));
            }
            else { return res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền đăng hồ sơ.")); }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

//router ACTIVE CV
//PUT active Hồ sơ người đăng
router.put('/active-cv', async (req, res) => {
    req.checkBody('CategoryID', 'Sai định dạng danh mục').isInt();
    req.checkBody('UserWorkerID', 'Sai định dạng tài khoản id').isInt();
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let objectValue = req.body;
                objectValue.UserAccountID = resultOfJWT.UserAccountID;
                let resultOfCVM = await cvModel.putActiveCV(objectValue);
                if (resultOfCVM.affectedRows > 0) {
                    res.status(200).json(helper.jsonSuccessTrue("Đã xác nhận hồ sơ."));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy dữ liệu để active."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Bạn không có quyền active tài khoản người làm."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token."));
        }
    }
});
//Delete hồ sơ chưa active
router.delete('/active-cv', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let objectValue = req.query;
            if (!isNaN(objectValue.categoryid) && objectValue.categoryid != "" && !isNaN(objectValue.userworkerid) && objectValue.userworkerid != "") {
                let resultOfCVM = await cvModel.deleteCV(objectValue);
                if (resultOfCVM.affectedRows > 0) { res.status(200).json(helper.jsonSuccessTrue("Đã xóa hồ sơ.")); }
                else {
                    return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy hồ sơ để xóa."));
                }
            } else {
                return res.status(404).json(helper.jsonErrorDescription("Đường dẫn không đúng."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Bạn không có quyền xóa hồ sơ này."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token."));
    }
});

//router not-activated
//GET
router.get('/not-activated', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let resultOfUNA = await cvModel.getUserNotActivated(0, 2);
            for (let i = 0; i < resultOfUNA.length; i++) {
                resultOfUNA[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultOfUNA[i].Image}`
            }
            if (resultOfUNA.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(resultOfUNA)); }
            else { res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!")); }
        } else {
            res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền lấy danh sách."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token."));
    }
});

//Router Activated
router.get('/activated/:useraccountid', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID) {
            let resultOfUA = await cvModel.getUserActivated(req.params.useraccountid, 1);
            for (let i = 0; i < resultOfUA.length; i++) {
                resultOfUA[i].ImageStore = `${linkServer.hethonghotrotimviec.urlServer}${resultOfUA[i].ImageStore}`
            }
            if (resultOfUA.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(resultOfUA)); }
            else { res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!")); }
        } else {
            res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền lấy danh sách."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token."));
    }
});

//Router get all cv not activated by userID
router.get('/not-activated-by-userid', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 2) {
            let resultOfUA = await cvModel.getUserActivated(resultOfJWT.UserAccountID, 0);
            for (let i = 0; i < resultOfUA.length; i++) {
                resultOfUA[i].ImageStore = `${linkServer.hethonghotrotimviec.urlServer}${resultOfUA[i].ImageStore}`
            }
            if (resultOfUA.length > 0) {
                res.status(200).json(helper.jsonSuccessTrueResult(resultOfUA));
            } else {
                res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!"));
            }
        } else {
            res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền lấy danh sách"));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

router.put('/not-activated-by-userid', async (req, res) => {
    req.checkBody('CategoryID', 'Danh mục bị lỗi').isInt();
    req.checkBody('Exprience', 'Sai định dạng kiểu dữ liệu của năm kinh nghiệm').isFloat({ min: 0.0 });
    req.checkBody('Qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('GeneralInformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 2) {
                let objectValue = req.body;
                objectValue.UserAccountID = resultOfJWT.UserAccountID;
                objectValue.Qualifications = objectValue.Qualifications.trim();
                objectValue.GeneralInformation = objectValue.GeneralInformation.trim();
                let resultNACV = await cvModel.putNotActivatedCV(objectValue);
                if (resultNACV.affectedRows > 0) {
                    res.status(200).json(helper.jsonSuccessTrueResult("Đã chỉnh sửa hồ sơ thành công"));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Hồ sơ không tồn tại"));
                }
            } else {
                res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền chỉnh sửa hồ sơ"));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
        }
    }
});

router.delete('/not-activated-by-userid', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 2) {
            let objectValue = req.query;
            objectValue.userworkerid = resultOfJWT.UserAccountID;
            if (!isNaN(objectValue.categoryid) && objectValue.categoryid != "") {
                let resultDCV = await cvModel.deleteCV(objectValue);
                if (resultDCV.affectedRows > 0) {
                    res.status(200).json(helper.jsonSuccessTrue("Đã xóa hồ sơ thành công"));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Hồ sơ không tồn tại"));
                }
            } else {
                return res.status(404).json(helper.jsonErrorDescription("Đường dẫn không đúng."));
            }
        } else {
            res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền xóa hồ sơ"));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

//Router get all cv not activated by userID
router.get('/activated-by-query', async (req, res) => {
    try {
        let result = await helper.jwtVerifyLogin(req.header("authorization"));
        if (result.UserTypeID > 0 && result.UserTypeID < 4) {
            let strQuery = CVScript.selectCVByQuery;
            if (!isNaN(req.query.categoryid) && !!req.query.categoryid) {
                strQuery = `${strQuery} AND ujc.CategoryID = ${req.query.categoryid}`
            }
            if (!isNaN(req.query.provinceid) && !!req.query.provinceid) {
                strQuery = `${strQuery} AND ua.ProvinceID = ${req.query.provinceid}`
            }
            if (!isNaN(req.query.districtid) && !!req.query.districtid) {
                strQuery = `${strQuery} AND ua.DistrictID = ${req.query.districtid}`
            }
            if (!isNaN(req.query.wardid) && !!req.query.wardid) {
                strQuery = `${strQuery} AND ua.WardID = ${req.query.wardid}`
            }
            let resultOfUA = await cvModel.getCVByQuery(strQuery, 2, 1);
            if (resultOfUA.length > 0) {
                for (let i = 0; i < resultOfUA.length; i++) {
                    resultOfUA[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultOfUA[i].Image}`
                }
                res.status(200).json(helper.jsonSuccessTrueResult(resultOfUA));
            } else {
                res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!"));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền lấy danh sách"));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

router.get('/get-all-cv-by-userid', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 2) {
            let resultOfUA = await cvModel.selectCVByUserID(resultOfJWT.UserAccountID);
            for (let i = 0; i < resultOfUA.length; i++) {
                resultOfUA[i].ImageStore = `${linkServer.hethonghotrotimviec.urlServer}${resultOfUA[i].ImageStore}`
            }
            if (resultOfUA.length > 0) {
                res.status(200).json(helper.jsonSuccessTrueResult(resultOfUA));
            } else {
                res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!"));
            }
        } else {
            res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền lấy danh sách"));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

module.exports = router;