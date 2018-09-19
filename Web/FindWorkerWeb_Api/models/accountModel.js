var AccountScript = require('../databases/app_data/accountScript.json');
var helper = require('../helpers/helper');

//LOGIN AND SIGNUP
//GET
function getVerifyByEmail(email) {
    return helper.sendQueryToDatabase(
        AccountScript.selectVerifyByEmail,
        [email]
    );
};
//POST
function postCheckInforLoginUseUsername(user, isMail) {
    if (isMail) {
        return helper.sendQueryToDatabase(
            AccountScript.selectCheckInforLoginUseEmail,
            [user]
        );
    } else {
        return helper.sendQueryToDatabase(
            AccountScript.selectCheckInforLogin,
            [user]
        );
    }
};

function postSignUpForAllUser(account, UserTypeID) {
    return helper.sendQueryToDatabase(
        AccountScript.insertSignUpForAllUser,
        [
            account.email,
            account.username,
            account.password,
            account.fullname,
            account.codeActive,
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
            profile.birthday,
            profile.image,
            profile.personid,
            profile.provinceid,
            profile.districtid,
            profile.wardid,
            profile.streetname,
            profile.useraccountid
        ]
    );
};
function updateStatusAccount(profile, statusAccount) {
    return helper.sendQueryToDatabase(
        AccountScript.updateStatusAccount,
        [
            statusAccount,
            profile.email,
            profile.codeactive
        ]
    );
};
function updateCodeActive(objectValue) {
    return helper.sendQueryToDatabase(
        AccountScript.updateStatusAccount,
        [
            objectValue.email,
            objectValue.codeactive
        ]
    );
};

module.exports = { getVerifyByEmail, postCheckInforLoginUseUsername, postSignUpForAllUser, getProfileInform, updateProfileInform, updateStatusAccount, updateCodeActive };