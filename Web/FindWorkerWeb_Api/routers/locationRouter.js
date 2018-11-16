const express = require('express');
const router = express.Router();

const locationModel = require('../models/locationModel');
const helper = require('../helpers/helper');

const validator = require('validator');

router.get('/all-province', async (req, res) => {
    try {
        let result = await locationModel.getAllProvince();
        if (result.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(result)); }
        else { res.status(200).json(helper.jsonSuccessFalse("Danh sách tên Tỉnh, Thành phố trống!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi khi lấy tên tỉnh"));
    }
});

router.get('/all-district-by-provinceid', async (req, res) => {
    try {
        let result = await locationModel.getAllDistrictByProvinceid(req.query.provinceid.trim());
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
        let result = await locationModel.getAllWardByDistrictid(req.query.districtid.trim());
        if (result.length > 0) { res.status(200).json(helper.jsonSuccessTrueResult(result)); }
        else { res.status(200).json(helper.jsonSuccessFalse("Danh sách tên Phường, Xã không tồn tại!!!")); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi khi lấy tên tỉnh"));
    }
    // }
});

router.put('/geolocation', async (req, res) => {
    try {
        let objectValue = req.body;
        if (validator.isLatLong(`${objectValue.Latitude},${objectValue.Longitude}`)) {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID > 0 && resultOfJWT.UserTypeID < 4) {
                objectValue.UserAccountID = resultOfJWT.UserAccountID;
                let resultOfCVM = await locationModel.putInfoGeolocationByUserID(objectValue);
                if (resultOfCVM.affectedRows > 0) {
                    res.status(200).json(helper.jsonSuccessTrue("Đã cập nhật vị trí thành công"));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy dữ liệu để cập nhật vị trí"));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Bạn không có quyền cập nhật vị trí"));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Sai định dạng kinh độ và vĩ độ"));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Lỗi xác thực token"));
    }
});

module.exports = router;