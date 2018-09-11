var express = require('express');
var router = express.Router();

var categoryModel = require('../models/categoryModel');
var helper = require('../helpers/helper');

router.get('/get-all', async (req, res) => {
    try {
        await helper.jwtVerifyLogin(req.header("authorization"));
        let resultOfgAJC = await categoryModel.getAllJobCategory();
        if (resultOfgAJC.length > 0) { res.status(200).json({ "success": true, "result": resultOfgAJC }); }
        else { res.status(200).json({ "success": false, "message": "Danh sách trống!!!" }); }
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            "error": "invalid_grant",
            "error_description": "Lỗi xác thực token"
        });
    }
});

router.get('/get-by-userworkerid', async (req, res) => {
    try {
        let resultJWT = await helper.jwtVerifyLogin(req.header("authorization"));

        let useraccount = {
            useraccountid: resultJWT.UserAccountID
        }
        
        let resultOfgAJC = await categoryModel.getJobCategoryByUserWorkerID(useraccount);
        if (resultOfgAJC.length > 0) { res.status(200).json({ "success": true, "result": resultOfgAJC }); }
        else { res.status(200).json({ "success": false, "message": "Danh sách trống!!!" }); }
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            "error": "invalid_grant",
            "error_description": "Lỗi xác thực token"
        });
    }
});

module.exports = router;