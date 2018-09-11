var AccountScript = require('../databases/app_data/accountScript.json');
var helper = require('../helpers/helper');

//LOGIN AND SIGNUP
//POST
function postCheckInforLogin(user) {
    return helper.sendQueryToDatabase(
        AccountScript.selectCheckInforLogin,
        [user.username, user.password]
    );
};

function postSignUpForAllUser(account, UserTypeID) {
    return helper.sendQueryToDatabase(
        AccountScript.insertSignUpForAllUser,
        [
            account.email,
            account.username,
            account.password,
            account.fullname,
            UserTypeID,
            account.email,
            account.username
        ]
    );
};

//PROFILE
//GET
function getProfileInform(UserAccountID) {
    return helper.sendQueryToDatabase(
        AccountScript.selectProfileInform,
        [UserAccountID]
    );
};

//UPDATE
function updateProfileInform(profile) {
    return helper.sendQueryToDatabase(
        AccountScript.updateProfileInform,
        [
            profile.fullname,
            profile.ismale,
            profile.phonenumber,
            profile.place,
            profile.birthday,
            profile.image,
            profile.personid,
            profile.useraccountid
        ]
    );
};

module.exports = { postCheckInforLogin, postSignUpForAllUser, getProfileInform, updateProfileInform };