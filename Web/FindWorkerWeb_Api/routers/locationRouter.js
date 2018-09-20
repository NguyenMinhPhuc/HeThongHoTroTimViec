var express = require('express');
var router = express.Router();

var locationModel = require('../models/locationModel');
var helper = require('../helpers/helper');

var validator = require('validator');

var result = {};

router.get('/all-province', async (req, res) => {
    try {
        result = {};
        result = await locationModel.getAllProvince();
        if (result.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(result)); }
        else { res.status(200).json(helper.jsonSuccessFalse("Danh sách tên Tỉnh, Thành phố trống!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi khi lấy tên tỉnh"));
    }
});

router.get('/all-district-by-provinceid', async (req, res) => {
    try {
        result = {};
        result = await locationModel.getAllDistrictByProvinceid(req.query.provinceid.trim());
        if (result.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(result)); }
        else { res.status(200).json(helper.jsonSuccessFalse("Danh sách tên Quận, Huyện, Thành phố không tồn tại!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi khi lấy tên tỉnh"));
    }
    // }
});

router.get('/all-ward-by-districtid', async (req, res) => {
    try {
        result = {};
        result = await locationModel.getAllWardByDistrictid(req.query.districtid.trim());
        if (result.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(result)); }
        else { res.status(200).json(helper.jsonSuccessFalse("Danh sách tên Phường, Xã không tồn tại!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi khi lấy tên tỉnh"));
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
                    res.status(200).json(helper.jsonSuccessTrue("Đã cập nhật vị trí thành công"));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy dữ liệu để cập nhật vị trí"));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Bạn không có quyền cập nhật vị trí"));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
        }
    } else {
        return res.status(400).json(helper.jsonErrorDescription("Sai định dạng kinh độ và vĩ độ"));
    }
});

module.exports = router;