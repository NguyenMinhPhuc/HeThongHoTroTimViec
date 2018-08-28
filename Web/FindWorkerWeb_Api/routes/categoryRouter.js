var express = require('express');
var router = express.Router();

var categoryModel = require('../models/categoryModel');
var helper = require('../helpers/helper');

router.get('/get-all-category', async (req, res) => {
    try {
        await helper.jwtVerifyLogin(req.header("authorization"));
        let resultOfgAJC = await categoryModel.getAllJobCategory();
        res.status(200).json(resultOfgAJC);
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            "error": "invalid_grant",
            "error_description": "Lỗi xác thực token"
        });
    }
});

module.exports = router;