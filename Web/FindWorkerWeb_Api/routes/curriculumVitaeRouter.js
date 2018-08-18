var express = require('express');
var router = express.Router();

var cvModel = require('../models/cvModel');
var helper = require('../helpers/helper');
//GET
router.get('/', (req, res) => {
    helper.jwtVerifyLogin(req.header("authorization"))
        .then(resultOfJWT => {
            if (resultOfJWT.UserTypeID == 1) {
                return cvModel.getUserNotActivated(0, 2);
            } else {
                res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Loại tài khoản của bạn không có quyền lấy danh sách"
                });
            }
        })
        .then(resultOfUNA => { res.json(200, resultOfUNA); })
        .catch(err => {
            console.log(err.message);
            return res.json(500, {
                "error": "invalid_grant",
                "error_description": "Lỗi xác thực token"
            });
        });
})
//POST đăng hồ sơ để đợi duyệt
router.post('/', (req, res) => {
    req.checkBody('namejobcategory', 'Tên danh mục chứa ít nhất 3 ký tự').trim().isLength({ min: 3 });
    req.checkBody('exprience', 'Không phải là số điện thoại').isFloat({ min: 0.0 });
    req.checkBody('qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('generalinformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    req.checkBody('imagestore', 'Định dạng không phải là URL').trim().isURL();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        helper.jwtVerifyLogin(req.header("authorization"))
            .then(results => {
                if (results.UserTypeID == 2) {
                    let cv = {
                        userworkerid: results.UserAccountID,
                        namejobcategory: req.body.namejobcategory.trim(),
                        exprience: req.body.exprience.trim(),
                        qualifications: req.body.qualifications.trim(),
                        generalinformation: req.body.generalinformation.trim(),
                        imagestore: req.body.imagestore.trim()
                    };
                    if (req.body.categoryid == undefined) cv.categoryid = null;//nếu categoryid là undefined thì gắn thành null để hạn chế lỗi
                    else cv.categoryid = req.body.categoryid;
                    cvModel.getJobCategoryID(cv.categoryid, cv.namejobcategory)//select xem category có tồn tại không
                        .then(result => {
                            if (result.length > 0) {
                                cv.namejobcategory = result[0].NameJobCategory;//nếu đã tồn tại categoryID thì lấy tên trong database gán vào
                                cv.categoryid = result[0].CategoryID;//nếu đã tồn tại categoryID thì lấy categoryID trong database gán vào
                                cvModel.postJobCategoryByCategoryID(cv)
                                    .then(resultPJC => {
                                        if (resultPJC.affectedRows > 0) {//kiểm tra số dòng đã insert thành công
                                            return res.json(200, { "success": true });
                                        }
                                        return res.json(400, {
                                            "error": "invalid_grant",
                                            "error_description": "Thông tin hồ sơ bị trùng"
                                        });
                                    })
                                    .catch(errPJC => {
                                        return res.json(500, errPJC);
                                    })
                            }
                            else {
                                cvModel.postJobCategoryNotByCategoryID(cv)
                                    .then(resultPJCNC => {
                                        if (resultPJCNC.affectedRows > 0) {//kiểm tra số dòng đã insert thành công
                                            return res.json(200, { "success": true });
                                        }
                                        return res.json(400, {
                                            "error": "invalid_grant",
                                            "error_description": "Đăng hồ sơ không thành công"
                                        });
                                    })
                                    .catch(errPJCNC => {
                                        return res.json(500, errPJCNC);
                                    })
                            }
                        })
                        .catch(err => {
                            return res.json(500, err);
                        })
                }
                else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Loại tài khoản của bạn không có quyền đăng hồ sơ"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                return res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Token không tồn tại hoặc đã hết hạn"
                });
            });
    }
});
//PUT active Hồ sơ người đăng
router.put('/', (req, res) => {
    req.checkBody('categoryid', 'Sai định dạng danh mục').trim().isInt();
    req.checkBody('userworkerid', 'Sai định dạng tài khoản id').trim().isInt();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        helper.jwtVerifyLogin(req.header("authorization"))
            .then(resultOfJWT => {
                if (resultOfJWT.UserTypeID == 1) {
                    let cvMD = {
                        useraccountid: resultOfJWT.UserAccountID,
                        categoryid: req.body.categoryid.trim(),
                        userworkerid: req.body.userworkerid.trim()
                    };
                    return cvModel.putActiveCV(cvMD);
                } else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Bạn không có quyền active tài khoản người làm"
                    });
                }
            })
            .then(resultOfCVM => {
                if (resultOfCVM.affectedRows > 0) {//kiểm tra số dòng đã được update
                    res.json(200, { "success": true });
                } else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Không tìm thấy dữ liệu để active"
                    });
                }
            })
            .catch(err => {
                console.log(err.message);
                return res.json(500, {
                    "error": "invalid_grant",
                    "error_description": "Lỗi xác thực token"
                });
            });
    }
});
//Delete hồ sơ chưa active
router.delete('/', (req, res) => {
    req.checkBody('categoryid', 'Sai định dạng danh mục').trim().isInt();
    req.checkBody('userworkerid', 'Sai định dạng tài khoản id').trim().isInt();
    if (req.validationErrors()) return res.json(400, { "error": req.validationErrors() });
    else {
        helper.jwtVerifyLogin(req.header("authorization"))
            .then(resultOfJWT => {
                if (resultOfJWT.UserTypeID == 1) {
                    let cvdelete = {
                        categoryid: req.body.categoryid.trim(),
                        userworkerid: req.body.userworkerid.trim()
                    };
                    return cvModel.deleteCV(cvdelete);
                } else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Bạn không có quyền xóa hồ sơ người làm"
                    });
                }
            })
            .then(resultOfCVM => {
                if (resultOfCVM.affectedRows > 0) {//kiểm tra số dòng đã được delete
                    res.json(200, { "success": true });
                } else {
                    return res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Không tìm thấy dữ liệu để xóa"
                    });
                }
            })
            .catch(err => {
                console.log(err.message);
                return res.json(500, {
                    "error": "invalid_grant",
                    "error_description": "Lỗi xác thực token"
                });
            });
    }
});

module.exports = router;