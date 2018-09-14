var jwt = require('jsonwebtoken');
var Math = require('mathjs');

var db = require('../databases/createPool').connection;
var transporter = require('../configs/config').transporter;
var optionsSendMail = require('./seeds');

//decode với key trong config
function jwtVerifyLogin(token) {
    return new Promise((resolve, reject) => {
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
        })
    });
};

/**
 * Help Connect to DATABASE
 * @param {String} toEmail Send email to somebody
 * @param {Number} codeVery Code to very account
 */
function sendVerifyUseEmail(toEmail, fullName, linkVerify) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(optionsSendMail.mailOptions(toEmail, fullName, linkVerify), function (error, info) {
            if (error) {
                return reject(error);
            }
            return resolve(info.response);
        })
    })
};

function generateRandom6Number() {
    let result = 0;
    do {
        result = Math.floor(100000 + Math.random() * 900000);
    } while (result < 100000);
    return result;
};

module.exports = { jwtVerifyLogin, sendQueryToDatabase, sendVerifyUseEmail, generateRandom6Number };