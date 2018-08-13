var jwt = require('jsonwebtoken');

var config = require('../configs/config.json').jsonwebtoken;

//decode với key trong config
function jwtVerifyLogin(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return reject(err);
            resolve(decoded);
        });
    })
};

module.exports = { jwtVerifyLogin };