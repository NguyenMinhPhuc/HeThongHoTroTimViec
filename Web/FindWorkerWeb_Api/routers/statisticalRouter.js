const router = require('express').Router();

const statisticalModel = require('../models/statisticalModel');
const helper = require('../helpers/helper');
const linkServer = require('../configs/config.json');

router.get('/get-all-user-worker', async function (req, res) {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        if (!!limit && !!page && Number.isInteger(limit) && Number.isInteger(page) && page > 0 && limit > 0) {
            let offset = helper.getOffset(page, limit);
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let resultOfSelectAllWorker = await statisticalModel.selectAllWorker(limit, offset);
                if (resultOfSelectAllWorker.length > 0) {
                    for (let i = 0; i < resultOfSelectAllWorker.length; i++) {
                        resultOfSelectAllWorker[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultOfSelectAllWorker[i].Image}`
                    }
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultOfSelectAllWorker));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách tài khoản thợ."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Sai định dạng."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.get('/get-all-user-guest', async function (req, res) {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        if (!!limit && !!page && Number.isInteger(limit) && Number.isInteger(page) && page > 0 && limit > 0) {
            let offset = helper.getOffset(page, limit);
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let resultOfSelectAllGuest = await statisticalModel.selectAllGuest(limit, offset);
                if (resultOfSelectAllGuest.length > 0) {
                    for (let i = 0; i < resultOfSelectAllGuest.length; i++) {
                        resultOfSelectAllGuest[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultOfSelectAllGuest[i].Image}`
                    }
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultOfSelectAllGuest));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách tài khoản khách."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Sai định dạng."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.get('/get-all-transaction-done', async function (req, res) {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        if (!!limit && !!page && Number.isInteger(limit) && Number.isInteger(page) && page > 0 && limit > 0) {
            let offset = helper.getOffset(page, limit);
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let resultOfSelectAllTransaction = await statisticalModel.selectAllTransactionDone(limit, offset);
                if (resultOfSelectAllTransaction.length > 0) {
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultOfSelectAllTransaction));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Dữ liệu trống."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách giao dịch."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Sai định dạng."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.put('/put-block-account-by-userid', async function (req, res) {
    req.checkBody('UserAccountID', 'Sai định dạng UserAccountID.').isInt();
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let UserAccountID = req.body.UserAccountID;
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let resultOfUpdateStatus = await statisticalModel.updateStatusAccountByUserID(-1, UserAccountID);
                if (resultOfUpdateStatus.affectedRows > 0) {
                    return res.status(200).json(helper.jsonSuccessTrue("Đã cập nhật trạng thái tài khoản thành công."));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Cập nhật không thành công."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền cập nhật trạng thái tài khoản."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

router.put('/put-enable-account-by-userid', async function (req, res) {
    req.checkBody('UserAccountID', 'Sai định dạng UserAccountID.').isInt();
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let UserAccountID = req.body.UserAccountID;
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserTypeID == 1) {
                let resultOfUpdateStatus = await statisticalModel.updateStatusAccountByUserID(1, UserAccountID);
                if (resultOfUpdateStatus.affectedRows > 0) {
                    return res.status(200).json(helper.jsonSuccessTrue("Đã cập nhật trạng thái tài khoản thành công."));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Cập nhật không thành công."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền cập nhật trạng thái tài khoản."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

module.exports = router;