var express = require('express');
var router = express.Router();

var cvModel = require('../models/cvModel');
var helper = require('../helpers/helper');
//GET
router.get('/', async (req, res) => {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let resultOfUNA = await cvModel.getUserNotActivated(0, 2);
            res.json(200, resultOfUNA);
        } else {
            res.json(400, {
                "error": "invalid_grant",
                "error_description": "Loại tài khoản của bạn không có quyền lấy danh sách"
            });
        }
    } catch (err) {
        console.log(err.message);
        return res.json(500, {
            "error": "invalid_grant",
            "error_description": "Lỗi xác thực token"
        });
    }
});
//POST đăng hồ sơ để đợi duyệt
router.post('/', async (req, res) => {
    req.checkBody('categoryid', 'Danh mục bị lỗi').trim().isInt();
    req.checkBody('namejobcategory', 'Tên danh mục bị sai định dạng').trim().isLength({ min: 3 });
    req.checkBody('exprience', 'Sai định dạng kiểu dữ liệu của kinh nghiệm').isFloat({ min: 0.0 });
    req.checkBody('qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('generalinformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    req.checkBody('imagestore', 'Định dạng không phải là URL').trim().isURL();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        let cv = {};
        try {
            let results = await helper.jwtVerifyLogin(req.header("authorization"));
            if (results.UserTypeID == 2) {
                cv.categoryid = req.body.categoryid.trim();
                cv.namejobcategory = req.body.namejobcategory.trim();
                cv.userworkerid = results.UserAccountID;
                cv.exprience = req.body.exprience.trim();
                cv.qualifications = req.body.qualifications.trim();
                cv.generalinformation = req.body.generalinformation.trim();
                cv.imagestore = req.body.imagestore.trim();
                //
                let resultgJC = await cvModel.getJobCategoryByID(cv.categoryid, cv.namejobcategory);
                if (resultgJC.length > 0) {
                    cv.categoryid = resultgJC[0].CategoryID;//nếu đã tồn tại categoryID thì lấy categoryID trong database gán vào
                    let resultpJCBCID = await cvModel.postJobCategoryByCategoryID(cv);
                    if (resultpJCBCID.affectedRows > 0) { return res.json(200, { "success": true }); }//kiểm tra số dòng đã insert thành công
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Thông tin hồ sơ bị trùng"
                    });
                }
                else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Mã danh mục hoặc tên danh mục không đúng"
                    });
                }
            }
            else {
                return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Loại tài khoản của bạn không có quyền đăng hồ sơ"
                });
            }
        } catch (err) {
            console.log(err.message);
            return res.json(500, {
                "error": "invalid_grant",
                "error_description": "Token không tồn tại hoặc đã hết hạn"
            });
        }
    }
});
//PUT active Hồ sơ người đăng
router.put('/', async (req, res) => {
    req.checkBody('categoryid', 'Sai định dạng danh mục').trim().isInt();
    req.checkBody('userworkerid', 'Sai định dạng tài khoản id').trim().isInt();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let cvMD = {
                    useraccountid: resultOfJWT.UserAccountID,
                    categoryid: req.body.categoryid.trim(),
                    userworkerid: req.body.userworkerid.trim()
                };
                let resultOfCVM = await cvModel.putActiveCV(cvMD);
                if (resultOfCVM.affectedRows > 0) {//kiểm tra số dòng đã được update
                    res.json(200, { "success": true });
                } else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Không tìm thấy dữ liệu để active"
                    });
                }
            } else {
                return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Bạn không có quyền active tài khoản người làm"
                });
            }
        } catch (err) {
            console.log(err.message);
            return res.json(500, {
                "error": "invalid_grant",
                "error_description": "Lỗi xác thực token"
            });
        }
    }
});
//Delete hồ sơ chưa active
router.delete('/', async (req, res) => {
    req.checkBody('categoryid', 'Sai định dạng danh mục').trim().isInt();
    req.checkBody('userworkerid', 'Sai định dạng tài khoản id').trim().isInt();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let cvdelete = {
                    categoryid: req.body.categoryid.trim(),
                    userworkerid: req.body.userworkerid.trim()
                };
                let resultOfCVM = await cvModel.deleteCV(cvdelete);
                if (resultOfCVM.affectedRows > 0) {//kiểm tra số dòng đã được delete
                    res.json(200, { "success": true });
                } else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Không tìm thấy dữ liệu để xóa"
                    });
                }
            } else {
                return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Bạn không có quyền xóa hồ sơ người làm"
                });
            }
        } catch (err) {
            console.log(err.message);
            return res.json(500, {
                "error": "invalid_grant",
                "error_description": "Lỗi xác thực token"
            });
        }
    }
});

module.exports = router;