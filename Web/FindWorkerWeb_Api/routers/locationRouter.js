var express = require('express');
var router = express.Router();

var locationModel = require('../models/locationModel');
var helper = require('../helpers/helper');

var validator = require('validator');

router.get('/all-province', async (req, res) => {
    try {
        let result = await locationModel.getAllProvince();
        if (result.length > 0) { res.status(200).json({ "success": true, "result": result }); }
        else { res.status(200).json({ "success": false, "message": "Danh sách tên Tỉnh, Thành phố trống!!!" }); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            "error": "invalid_grant",
            "error_description": "Lỗi khi lấy tên tỉnh"
        });
    }
});

router.get('/all-district-by-provinceid', async (req, res) => {
    // req.checkBody('provinceid', 'Mã Tỉnh, Thành phố phải là kiểu số').isInt();
    // req.checkBody('provinceid', 'Mã Tỉnh, Thành phố chứa nhiều nhất nhất 2 ký tự').trim().isLength({ max: 2 });
    // if (req.validationErrors()) {
    //     console.log(req.body.provinceid);
    //     return res.status(400).json({ "error": req.validationErrors() });}
    // else {
    try {
        let result = await locationModel.getAllDistrictByProvinceid(req.query.provinceid.trim());
        if (result.length > 0) { res.status(200).json({ "success": true, "result": result }); }
        else { res.status(200).json({ "success": false, "message": "Danh sách tên Quận, Huyện, Thành phố không tồn tại!!!" }); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            "error": "invalid_grant",
            "error_description": "Lỗi khi lấy tên tỉnh"
        });
    }
    // }
});

router.get('/all-ward-by-districtid', async (req, res) => {
    // req.checkBody('districtid', 'Mã Quận, Huyện, Thành phố phải là kiểu số').isInt();
    // req.checkBody('districtid', 'Mã Quận, Huyện, Thành phố chứa nhiều nhất nhất 3 ký tự').trim().isLength({ max: 3 });
    // if (req.validationErrors()) return res.status(400).json({ "error": req.validationErrors() });
    // else {
    try {
        let result = await locationModel.getAllWardByDistrictid(req.query.districtid.trim());
        if (result.length > 0) { res.status(200).json({ "success": true, "result": result }); }
        else { res.status(200).json({ "success": false, "message": "Danh sách tên Phường, Xã không tồn tại!!!" }); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            "error": "invalid_grant",
            "error_description": "Lỗi khi lấy tên tỉnh"
        });
    }
    // }
});

router.put('/geolocation', async (req, res) => {
    if (validator.isLatLong(`${req.body.latitude},${req.body.longitude}`)) {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID > 0 && resultOfJWT.UserTypeID < 4) {
                let geolocationMD = {
                    useraccountid: resultOfJWT.UserAccountID,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                };
                let resultOfCVM = await locationModel.putInfoGeolocationByUserID(geolocationMD);
                if (resultOfCVM.affectedRows > 0) {//kiểm tra số dòng đã được update
                    res.status(200).json({ "success": true });
                } else {
                    return res.status(400).json({
                        "error": "invalid_grant",
                        "error_description": "Không tìm thấy dữ liệu để cập nhật vị trí"
                    });
                }
            } else {
                return res.status(400).json({
                    "error": "invalid_grant",
                    "error_description": "Bạn không có quyền cập nhật vị trí"
                });
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                "error": "invalid_grant",
                "error_description": "Lỗi xác thực token"
            });
        }
    } else {
        return res.status(400).json({
            "error": "invalid_grant",
            "error_description": "Sai định dạng kinh độ và vĩ độ"
        })
    }
});

module.exports = router;