const express = require('express');
const router = express.Router();
const url = require("url");

const categoryModel = require('../models/categoryModel');
const helper = require('../helpers/helper');
const linkServer = require('../configs/config.json');

router.get('/get-all', async (req, res) => {
    try {
        await helper.jwtVerifyLogin(req.header("authorization"));
        let resultOfgAJC = await categoryModel.getAllJobCategory();
        if (resultOfgAJC.length > 0) {
            for (let i = 0; i < resultOfgAJC.length; i++) {
                resultOfgAJC[i].ImageStore = `${linkServer.hethonghotrotimviec.urlServer}${resultOfgAJC[i].ImageStore}`
            }
            return res.status(200).json(helper.jsonSuccessTrueResult(resultOfgAJC));
        }
        else { return res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(400).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

router.get('/get-by-userworkerid', async (req, res) => {
    try {
        let resultJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        let resultOfgAJC = await categoryModel.getJobCategoryByUserWorkerID(resultJWT.UserAccountID);
        if (resultOfgAJC.length > 0) { return res.status(200).json(helper.jsonSuccessTrueResult(resultOfgAJC)); }
        else { return res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(400).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

router.post('/create-category', async (req, res) => {
    req.checkBody('NameJobCategory', 'Tên danh mục quá ngắn').trim().isLength({ min: 5 });
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let result = await helper.jwtVerifyLogin(req.header("authorization"));
            if (result.UserTypeID == 1) {
                let objectValue = req.body;
                objectValue.ImageStore = url.parse(objectValue.ImageStore).pathname;
                let resultRowInserted = await categoryModel.postJobCategory(objectValue);
                if (resultRowInserted.affectedRows > 0) { return res.status(200).json(helper.jsonSuccessTrue("Đã đăng danh mục thành công.")); }
                else { return res.status(400).json(helper.jsonErrorDescription("Thông tin danh mục bị trùng.")); }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền thêm mới danh mục"));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(400).json(helper.jsonErrorDescription("Lỗi xác thực token"));
        }
    }
});

router.put('/update-category', async (req, res) => {
    req.checkBody('NameJobCategory', 'Tên danh mục quá ngắn.').trim().isLength({ min: 5 });
    req.checkBody('CategoryID', 'Mã danh mục không phải là số.').isInt();
    if (req.validationErrors()) return res.status(400).json(helper.jsonError(req.validationErrors()));
    else {
        try {
            let result = await helper.jwtVerifyLogin(req.header("authorization"));
            if (result.UserTypeID == 1) {
                let objectValue = req.body;
                objectValue.ImageStore = url.parse(objectValue.ImageStore).pathname;
                let resultRowInserted = await categoryModel.putJobCategory(objectValue);
                if (resultRowInserted.affectedRows > 0) { return res.status(200).json(helper.jsonSuccessTrue(`Đã cập nhật danh mục ${objectValue.NameJobCategory} thành công.`)); }
                else { return res.status(400).json(helper.jsonErrorDescription(`Không tìm thấy danh mục ${objectValue.NameJobCategory}.`)); }
            } else { return res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền chỉnh sửa danh mục")); }
        } catch (err) {
            console.log(err.message);
            return res.status(400).json(helper.jsonErrorDescription("Lỗi xác thực token"));
        }
    }
});

router.get('/get-all-cv-by-categoryid', async function (req, res) {
    try {
        let categoryid = Number(req.query.categoryid);
        if (!!categoryid && Number.isInteger(categoryid) && categoryid > 1000) {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let resultOfInfoCV = await categoryModel.selectInfoCVByCategoryID(categoryid);
                if (resultOfInfoCV.length > 0) {
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultOfInfoCV));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách hồ sơ thợ."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Sai định dạng."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

module.exports = router;