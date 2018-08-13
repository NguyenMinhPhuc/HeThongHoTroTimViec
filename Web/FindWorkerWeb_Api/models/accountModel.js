var db = require('../databases/createPool');

function postCheckInforLogin(user) {
    return new Promise((resolve, reject) => {
        db.connection.query("SELECT UserAccountID, Username, Password, UserTypeID FROM useraccounts WHERE Username = ? and Password = ?", [user.username, user.password], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        })
    });
};
function postSignUpForAllUser(account, UserTypeID) {
    return new Promise((resolve, reject) => {
        db.connection.query(`INSERT INTO useraccounts ( Email , Username , Password , FullName , UserTypeID) VALUES (?,?,?,?,?)`, [account.email, account.username, account.password, account.fullname, UserTypeID], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        })
    });
};

module.exports = { postCheckInforLogin, postSignUpForAllUser };