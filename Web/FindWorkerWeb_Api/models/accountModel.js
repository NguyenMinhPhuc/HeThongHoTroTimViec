var db = require('../databases/createPool');
var AccountScript = require('../databases/app_data/accountScript.json');
//GET
function getProfileInform(UserAccountID) {
    return new Promise((resolve, reject) => {
        db.connection.query(AccountScript.selectProfileInform, [UserAccountID], (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
}
//POST
function postCheckInforLogin(user) {
    return new Promise((resolve, reject) => {
        db.connection.query(AccountScript.selectCheckInforLogin, [user.username, user.password], (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
};
function postSignUpForAllUser(account, UserTypeID) {
    return new Promise((resolve, reject) => {
        db.connection.query(AccountScript.insertSignUpForAllUser,
            [account.email, account.username, account.password, account.fullname, UserTypeID, account.email, account.username],
            (err, results) => {
                if (err) { return reject(err); }
                return resolve(results);
            })
    });
};
//UPDATE
function updateProfileInform(profile) {
    return new Promise((resolve, reject) => {
        db.connection.query(AccountScript.updateProfileInform,
            [profile.fullname, profile.ismale, profile.phonenumber, profile.place, profile.birthday, profile.image, profile.personid, profile.useraccountid],
            (err, results) => {
                if (err) { return reject(err); }
                return resolve(results);
            })
    });
}
module.exports = { postCheckInforLogin, postSignUpForAllUser, getProfileInform, updateProfileInform };