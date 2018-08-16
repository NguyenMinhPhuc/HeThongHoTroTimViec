var jwt = require('jsonwebtoken');

//decode với key trong config
function jwtVerifyLogin(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) return reject(err);
            return resolve(decoded);
        });
    })
};

module.exports = { jwtVerifyLogin };