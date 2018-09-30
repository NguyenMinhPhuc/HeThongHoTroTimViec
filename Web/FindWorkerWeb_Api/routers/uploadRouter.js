var router = require('express').Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var helper = require('../helpers/helper');
var linkServer = require('../configs/config.json');
var imageDefault = require('../helpers/seeds');

var uploadAvatar = multer({
    dest: '../public/uploads/images/avatars/',
    limits: { fileSize: 5242880 },
    fileFilter: function (req, file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb("EXTNAME_DONT_IMAGE", null);
        }
    }
}).single('Image');

var uploadStore = multer({
    dest: '../public/uploads/images/stores/',
    limits: { fileSize: 5242880 },
    fileFilter: function (req, file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb("EXTNAME_DONT_IMAGE", null);
        }
    }
}).single('ImageStore');

var result = {};

router.post('/image-avatar', async (req, res) => {
    try {
        result = "";
        result = await helper.jwtVerifyLogin(req.header("authorization"));
        if (result.UserTypeID >= 1 && result.UserTypeID <= 3) {
            uploadAvatar(req, res, function (err) {
                if (err) {
                    if (err.code == "LIMIT_FILE_SIZE") { return res.status(400).json(helper.jsonErrorDescription("Kích thước ảnh tối đa là 5mb.")); }
                    else if (err == "EXTNAME_DONT_IMAGE") { return res.status(400).json(helper.jsonErrorDescription("Sai đuôi mở rộng của ảnh.")); }
                    else { return res.status(500).json(helper.jsonError(err.message)); }
                }
                else {
                    if (req.file == undefined) {
                        return res.status(400).json(helper.jsonErrorDescription("Không ảnh nào được chọn."));
                    } else {
                        //thay đổi tên file
                        let nameFile = `/uploads/images/avatars/${result.UserAccountID}-${Date.now()}${path.extname(req.file.originalname)}`;
                        fs.rename(
                            req.file.path,
                            `../public${nameFile}`,
                            (err) => {
                                if (err) { return res.status(500).json(helper.jsonErrorDescription("Đổi tên ảnh bị lỗi.")); }
                                else {
                                    // Return tên file về.
                                    return res.status(200).json(helper.jsonSuccessTrueResult({
                                        "path": `${linkServer.hethonghotrotimviec.urlServer}${nameFile}`
                                    }));
                                }
                            });
                    }
                }
            });
        } else {
            res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền đăng ảnh."));
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn"));
    }
});

router.post('/image-store', async (req, res) => {
    try {
        result = "";
        result = await helper.jwtVerifyLogin(req.header("authorization"));
        if (result.UserTypeID == 1) {
            uploadStore(req, res, function (err) {
                if (err) {
                    if (err.code == "LIMIT_FILE_SIZE") { return res.status(400).json(helper.jsonErrorDescription("Kích thước ảnh tối đa là 5mb.")); }
                    else if (err == "EXTNAME_DONT_IMAGE") { return res.status(400).json(helper.jsonErrorDescription("Sai đuôi mở rộng của ảnh.")); }
                    else { return res.status(500).json(helper.jsonError(err.message)); }
                }
                else {
                    if (req.file == undefined) {
                        return res.status(400).json(helper.jsonErrorDescription("Không ảnh nào được chọn."));
                    } else {
                        //thay đổi tên file
                        let nameFile = `/uploads/images/stores/${result.UserAccountID}-${Date.now()}${path.extname(req.file.originalname)}`;
                        fs.rename(
                            req.file.path,
                            `../public${nameFile}`,
                            (err) => {
                                if (err) { return res.status(500).json(helper.jsonErrorDescription("Đổi tên ảnh bị lỗi.")); }
                                else {
                                    // Return tên file về.
                                    return res.status(200).json(helper.jsonSuccessTrueResult({
                                        "path": `${linkServer.hethonghotrotimviec.urlServer}${nameFile}`
                                    }));
                                }
                            });
                    }
                }
            });
        } else { res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền đăng ảnh.")); }
    } catch (err) {
        console.log(err);
        return res.status(400).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.get('/image-store-default', async (req, res) => {
    try {
        result = "";
        result = await helper.jwtVerifyLogin(req.header("authorization"));
        if (result.UserTypeID > 0 && result.UserTypeID < 4) {
            res.status(200).json(helper.jsonSuccessTrueResult(imageDefault.linkImageStoreDefault()));
        } else { res.status(400).json(helper.jsonErrorDescription("Loại tài khoản của bạn không có quyền đăng ảnh.")); }
    } catch (err) {
        console.log(err);
        return res.status(400).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

module.exports = router;