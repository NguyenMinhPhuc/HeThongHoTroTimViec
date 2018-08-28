var jwt = require('jsonwebtoken');

//decode với key trong config
function jwtVerifyLogin(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.FWF_SECRET, function (err, decoded) {
            if (err) return reject(err);
            resolve(decoded);
        });
    })
};

module.exports = { jwtVerifyLogin };