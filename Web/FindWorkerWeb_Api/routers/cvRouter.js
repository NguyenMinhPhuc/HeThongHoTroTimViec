var express = require('express');
var router = express.Router();

var cvModel = require('../models/cvModel');
var helper = require('../helpers/helper');
var CVScript = require('../databases/app_data/curriculumVitaeScript.json');

var result = {};
//router post
//POST đăng hồ sơ để đợi duyệt
router.post('/post', async (req, res) => {
    req.checkBody('categoryid', 'Danh mục bị lỗi').isInt();
    req.checkBody('namejobcategory', 'Tên danh mục bị sai định dạng').trim().isLength({ min: 3 });
    req.checkBody('exprience', 'Sai định dạng kiểu dữ liệu của năm kinh nghiệm').isFloat({ min: 0.0 });
    req.checkBody('qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('generalinformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    req.checkBody('imagestore', 'Định dạng không phải là URL').trim().isURL();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        let cv = {};
        try {
            let results = await helper.jwtVerifyLogin(req.header("authorization"));
            if (results.UserTypeID == 2) {
                cv.categoryid = req.body.categoryid;
                cv.namejobcategory = req.body.namejobcategory.trim();
                cv.userworkerid = results.UserAccountID;
                cv.exprience = req.body.exprience;
                cv.qualifications = req.body.qualifications.trim();
                cv.generalinformation = req.body.generalinformation.trim();
                cv.imagestore = req.body.imagestore.trim();
                //
                let resultgJC = await cvModel.getJobCategoryByID(cv.categoryid, cv.namejobcategory);
                if (resultgJC.length > 0) {
                    cv.categoryid = resultgJC[0].CategoryID;//nếu đã tồn tại categoryID thì lấy categoryID trong database gán vào
                    let resultpJCBCID = await cvModel.postJobCategoryByCategoryID(cv);
                    if (resultpJCBCID.affectedRows > 0) { return res.status(200).json(helper.jsonSuccessTrue("Đã đăng hồ sơ thành công.")); }
                    return res.status(400).json(helper.jsonErrorDescription("Thông tin hồ sơ bị trùng."));
                }
                else { return res.status(400).json(helper.jsonErrorDescription("Mã danh mục hoặc tên danh mục không đúng.")); }
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
    req.checkBody('categoryid', 'Sai định dạng danh mục').isInt();
    req.checkBody('userworkerid', 'Sai định dạng tài khoản id').isInt();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let cvMD = {
                    useraccountid: resultOfJWT.UserAccountID,
                    categoryid: req.body.categoryid,
                    userworkerid: req.body.userworkerid
                };
                let resultOfCVM = await cvModel.putActiveCV(cvMD);
                if (resultOfCVM.affectedRows > 0) {//kiểm tra số dòng đã được update
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
    req.checkBody('categoryid', 'Sai định dạng danh mục').isInt();
    req.checkBody('userworkerid', 'Sai định dạng tài khoản id').isInt();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let cvdelete = {
                    categoryid: req.body.categoryid,
                    userworkerid: req.body.userworkerid
                };
                let resultOfCVM = await cvModel.deleteCV(cvdelete);
                if (resultOfCVM.affectedRows > 0) { res.status(200).json(helper.jsonSuccessTrue("Đã xóa hồ sơ.")); }
                else {
                    return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy hồ sơ để xóa."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Bạn không có quyền xóa hồ sơ người làm."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token."));
        }
    }
});

//router not-activated
//GET
router.get('/not-activated', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let resultOfUNA = await cvModel.getUserNotActivated(0, 2);
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
    req.checkBody('categoryid', 'Danh mục bị lỗi').isInt();
    req.checkBody('exprience', 'Sai định dạng kiểu dữ liệu của năm kinh nghiệm').isFloat({ min: 0.0 });
    req.checkBody('qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('generalinformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    req.checkBody('imagestore', 'Định dạng không phải là URL').trim().isURL();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 2) {
                let cv = {
                    categoryid: req.body.categoryid,
                    userworkerid: resultOfJWT.UserAccountID,
                    exprience: req.body.exprience,
                    qualifications: req.body.qualifications.trim(),
                    generalinformation: req.body.generalinformation.trim(),
                    imagestore: req.body.imagestore.trim()
                };
                let resultNACV = await cvModel.putNotActivatedCV(cv);
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
    req.checkBody('categoryid', 'Danh mục bị lỗi').isInt();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 2) {
                let cv = {
                    categoryid: req.body.categoryid,
                    userworkerid: resultOfJWT.UserAccountID
                };
                let resultDCV = await cvModel.deleteCV(cv);
                if (resultDCV.affectedRows > 0) {
                    res.status(200).json(helper.jsonSuccessTrue("Đã xóa hồ sơ thành công"));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Hồ sơ không tồn tại"));
                }
            } else {
                res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền xóa hồ sơ"));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
        }
    }
});

//Router get all cv not activated by userID
router.get('/activated-by-query', async (req, res) => {
    try {
        result = {};
        result = await helper.jwtVerifyLogin(req.header("authorization"));
        if (result.UserTypeID > 0 && result.UserTypeID < 4) {
            let strQuery = CVScript.selectCVByQuery;
            if (!isNaN(req.query.categoryid) && req.query.categoryid !== undefined && req.query.categoryid != "") {
                strQuery = `${strQuery} AND ujc.CategoryID = ${req.query.categoryid}`
            }
            if (!isNaN(req.query.provinceid) && req.query.provinceid !== undefined && req.query.provinceid.length >= 1) {
                strQuery = `${strQuery} AND ua.ProvinceID = ${req.query.provinceid}`
            }
            if (!isNaN(req.query.districtid) && req.query.districtid !== undefined && req.query.districtid.length >= 3) {
                strQuery = `${strQuery} AND ua.DistrictID = ${req.query.districtid}`
            }
            if (!isNaN(req.query.wardid) && req.query.wardid !== undefined && req.query.wardid.length >= 5) {
                strQuery = `${strQuery} AND ua.WardID = ${req.query.wardid}`
            }
            let resultOfUA = await cvModel.getCVByQuery(strQuery, 2, 1);
            if (resultOfUA.length > 0) {
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

module.exports = router;