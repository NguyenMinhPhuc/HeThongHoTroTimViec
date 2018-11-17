const express = require('express');
const router = express.Router();

const dashboardModel = require('../models/dashboardModel');
const helper = require('../helpers/helper');

router.get('/get-count-cv-by-categoryid', async function (req, res) {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let resultOfCountCV = await dashboardModel.selectCountCVByCategoryID();
            if (resultOfCountCV.length > 0) {
                return res.status(200).json(helper.jsonSuccessTrueResult(resultOfCountCV));
            } else {
                return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.get('/get-count-user-type', async function (req, res) {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let resultOfCountTypeID = await dashboardModel.selectCountTypeID();
            if (resultOfCountTypeID.length > 0) {
                return res.status(200).json(helper.jsonSuccessTrueResult(resultOfCountTypeID));
            } else {
                return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.get('/get-count-transaction', async function (req, res) {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 1) {
            let resultOfCountTransaction = await dashboardModel.selectCountTransaction();
            if (resultOfCountTransaction.length > 0) {
                for (let i = 0; i < resultOfCountTransaction.length; i++) {
                    let NameStatus = "";
                    if (resultOfCountTransaction[i].StatusEnd == 1) { NameStatus = "Giao dịch thành công"; }
                    else if (resultOfCountTransaction[i].StatusEnd == 0) { NameStatus = "Đang giao dịch"; }
                    else { NameStatus = "Giao dịch bị hủy"; }
                    resultOfCountTransaction[i].NameStatus = NameStatus;
                }
                return res.status(200).json(helper.jsonSuccessTrueResult(resultOfCountTransaction));
            } else {
                return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

module.exports = router;