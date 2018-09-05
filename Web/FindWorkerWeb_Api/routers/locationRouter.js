var express = require('express');
var router = express.Router();

var locationModel = require('../models/locationModel');
var helper = require('../helpers/helper');

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

router.post('/all-district-by-provinceid', async (req, res) => {
    req.checkBody('provinceid', 'Mã Tỉnh, Thành phố phải là kiểu số').isInt();
    req.checkBody('provinceid', 'Mã Tỉnh, Thành phố chứa nhiều nhất nhất 2 ký tự').trim().isLength({ max: 2 });
    if (req.validationErrors()) return res.status(400).json({ "error": req.validationErrors() });
    else {
        try {
            let result = await locationModel.postAllDistrictByProvinceid(req.body.provinceid.trim());
            if (result.length > 0) { res.status(200).json({ "success": true, "result": result }); }
            else { res.status(200).json({ "success": false, "message": "Danh sách tên Quận, Huyện, Thành phố không tồn tại!!!" }); }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                "error": "invalid_grant",
                "error_description": "Lỗi khi lấy tên tỉnh"
            });
        }
    }
});

router.post('/all-ward-by-districtid', async (req, res) => {
    req.checkBody('districtid', 'Mã Quận, Huyện, Thành phố phải là kiểu số').isInt();
    req.checkBody('districtid', 'Mã Quận, Huyện, Thành phố chứa nhiều nhất nhất 3 ký tự').trim().isLength({ max: 3 });
    if (req.validationErrors()) return res.status(400).json({ "error": req.validationErrors() });
    else {
        try {
            let result = await locationModel.postAllWardByDistrictid(req.body.districtid.trim());
            if (result.length > 0) { res.status(200).json({ "success": true, "result": result }); }
            else { res.status(200).json({ "success": false, "message": "Danh sách tên Phường, Xã không tồn tại!!!" }); }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                "error": "invalid_grant",
                "error_description": "Lỗi khi lấy tên tỉnh"
            });
        }
    }
});

module.exports = router;