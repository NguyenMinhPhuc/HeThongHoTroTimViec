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

function postSignUpForAllUser(account) {
    return helper.sendQueryToDatabase(
        AccountScript.insertSignUpForAllUser,
        [
            account.Email,
            account.Username,
            account.Password,
            account.Fullname,
            account.CodeActive,
            account.TypeAccount,
            account.Email,
            account.Username
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
            profile.FullName,
            profile.IsMale,
            profile.PhoneNumber,
            profile.Birthday,
            profile.Image,
            profile.PersonID,
            profile.ProvinceID,
            profile.DistrictID,
            profile.WardID,
            profile.StreetName,
            profile.PlaceName,
            profile.UserAccountID
        ]
    );
};
function updateStatusAccount(profile, statusAccount) {
    return helper.sendQueryToDatabase(
        AccountScript.updateStatusAccount,
        [
            statusAccount,
            profile.Email,
            profile.CodeActive
        ]
    );
};

function updateCodeActive(objectValue) {
    return helper.sendQueryToDatabase(
        AccountScript.updateStatusAccount,
        [objectValue.Email, objectValue.CodeActive]
    );
};

function putSocketID(objectValue) {
    return helper.sendQueryToDatabase(
        AccountScript.updateSocketID,
        [objectValue.SocketID, objectValue.UserAccountID]
    );
};

function updatePointAndCount(objectValue, UserAccountID) {
    return helper.sendQueryToDatabase(
        AccountScript.updatePointAndCount,
        [objectValue.PointsAverage, objectValue.CountPeopleRated, UserAccountID]
    );
};

//Select info account for chat
function selectInfoAccountChat(UserAccountID) {
    return helper.sendQueryToDatabase(
        AccountScript.selectInfoAccountForChat,
        [UserAccountID]
    )
}

module.exports = {
    selectInfoAccountChat,
    getVerifyByEmail,
    postCheckInforLoginUseUsername,
    postSignUpForAllUser,
    getProfileInform,
    updateProfileInform,
    updateStatusAccount,
    updateCodeActive,
    putSocketID,
    updatePointAndCount
};