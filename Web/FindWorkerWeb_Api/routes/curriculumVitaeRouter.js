var express = require('express');
var router = express.Router();


var helper = require('../helpers/helper');

router.post('/', (req, res) => {
    req.checkBody('namejobcategory', 'Tên danh mục chứa ít nhất 3 ký tự').trim().isLength({ min: 3 });
    req.checkBody('exprience', 'Không phải là số điện thoại').isFloat({ min: 0.0 });
    req.checkBody('qualifications', 'Bằng cấp chứa ít nhất 5 ký tự').trim().isLength({ min: 5 });
    req.checkBody('generalinformation', 'Thông tin chung chứa ít nhất 10 ký tự').trim().isLength({ min: 10 });
    req.checkBody('imagestore', 'Định dạng không phải là URL').trim().isURL();
    if (req.validationErrors()) res.json(400, { "error": req.validationErrors() });
    else {
        helper.jwtVerifyLogin(req.header("authorization"))
            .then(result => {
                if(result.UserTypeID === 1){
                    let cv = {
                        userworkerid: result.UserAccountID,
                        namejobcategory: req.body.namejobcategory.trim(),
                        exprience: req.body.exprience.trim(),
                        qualifications: req.body.qualifications.trim(),
                        generalinformation: req.body.generalinformation.trim(),
                        imagestore: req.body.imagestore.trim()
                    };
                }
                else{
                    res.json(400, {
                        "error": "invalid_grant",
                        "error_description": "Loại tài khoản của bạn không có quyền đăng CV"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.json(400, {
                    "error": "invalid_grant",
                    "error_description": "Token không tồn tại hoặc đã hết hạn"
                });
            });
    }
});

module.exports = router;