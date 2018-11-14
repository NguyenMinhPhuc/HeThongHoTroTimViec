var jwt = require('jsonwebtoken');
var Math = require('mathjs');
var multer = require('multer');
var path = require('path');

var db = require('../databases/createPool').connection;
var transporter = require('../configs/config').transporter;
var options = require('./seeds');

//decode với key trong config
function jwtVerifyLogin(token) {
    return new Promise((resolve, rejzect) => {
        jwt.verify(token, process.env.FW_SECRET, function (err, decoded) {
            if (err) return reject(err);
            resolve(decoded);
        });
    })
};

/**
 * Help Connect to DATABASE
 * @param {String} queryStatement Câu lệnh truy vấn
 * @param {Array} arrayValue Mảng giá trị
 */

function sendQueryToDatabase(queryStatement, arrayValue) {
    return new Promise((resolve, reject) => {
        return db.query(queryStatement, arrayValue, (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};

function getOffset(page, limit) {
    return (page - 1) * limit;
}

/**
 * Help Connect to EMAIL
 * @param {String} toEmail Send email to somebody
 * @param {Number} codeVery Code to very account
 */
function sendVerifyUseEmail(toEmail, fullName, linkVerify) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options.mailOptions(toEmail, fullName, linkVerify), function (error, info) {
            if (error) {
                return reject(error);
            }
            return resolve(info.response);
        })
    })
};

function sendEmailChangePassword(toEmail, password) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options.mailOptionsChangePassword(toEmail, password), function (error, info) {
            if (error) {
                return reject(error);
            }
            return resolve(info.response);
        })
    })
};

// Upload image config
// Set The Storage Engine
var storage = multer.diskStorage({
    destination: '../public/uploads/images/avatars/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage,
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
            return cb(true, null);
        }
    }
}).single('Image');

function generateRandom6Number() {
    let result = 0;
    do {
        result = Math.floor(100000 + Math.random() * 900000);
    } while (result < 100000);
    return result;
};

//RETURN JSON
function jsonError(strErr) {
    return {
        "error": strErr
    };
};
function jsonErrorDescription(strErr) {
    return {
        "error": "invalid_grant",
        "error_description": strErr
    };
};
function jsonSuccessFalse(strMessage) {
    return {
        "success": false,
        "message": strMessage
    };
};
function jsonSuccessTrue(strMessage) {
    return {
        "success": true,
        "message": strMessage
    };
};
function jsonSuccessTrueResult(strMessage) {
    return {
        "success": true,
        "result": strMessage
    };
};

module.exports = {
    jwtVerifyLogin,
    sendQueryToDatabase,
    getOffset,
    sendVerifyUseEmail,
    sendEmailChangePassword,
    generateRandom6Number,
    jsonErrorDescription,
    jsonSuccessFalse,
    jsonSuccessTrue,
    jsonSuccessTrueResult,
    jsonError,
    upload
};