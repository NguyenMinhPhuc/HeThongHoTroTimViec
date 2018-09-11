var jwt = require('jsonwebtoken');
var db = require('../databases/createPool');

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
        return db.connection.query(queryStatement, arrayValue, (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        })
    });
}

module.exports = { jwtVerifyLogin, sendQueryToDatabase };