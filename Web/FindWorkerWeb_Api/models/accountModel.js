const AccountScript = require('../databases/app_data/accountScript.json');
const helper = require('../helpers/helper');

class AccountClass {
    //LOGIN AND SIGNUP
    //GET
    getVerifyByEmail(email) {
        return helper.sendQueryToDatabase(
            AccountScript.selectVerifyByEmail,
            [email]
        );
    };
    selectPasswordByUserID(UserID) {
        return helper.sendQueryToDatabase(AccountScript.selectPasswordByUserID, [UserID]);
    };
    selectUserIDByEmail(Email) {
        return helper.sendQueryToDatabase(AccountScript.selectUserIDByEmail, [Email]);
    };
    //POST
    postCheckInforLoginUseUsername(user, isMail) {
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
    postSignUpForAllUser(account) {
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
    getProfileInform(UserAccountID) {
        return helper.sendQueryToDatabase(
            AccountScript.selectProfileInform,
            [UserAccountID]
        );
    };
    //UPDATE
    updateProfileInform(profile) {
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
    updateStatusAccount(profile, statusAccount) {
        return helper.sendQueryToDatabase(
            AccountScript.updateStatusAccount,
            [
                statusAccount,
                profile.Email,
                profile.CodeActive
            ]
        );
    };
    updateCodeActive(objectValue) {
        return helper.sendQueryToDatabase(
            AccountScript.updateStatusAccount,
            [objectValue.Email, objectValue.CodeActive]
        );
    };
    putSocketID(objectValue) {
        return helper.sendQueryToDatabase(
            AccountScript.updateSocketID,
            [objectValue.SocketID, objectValue.UserAccountID]
        );
    };
    updatePointAndCount(objectValue, UserAccountID) {
        return helper.sendQueryToDatabase(
            AccountScript.updatePointAndCount,
            [objectValue.PointsAverage, objectValue.CountPeopleRated, UserAccountID]
        );
    };
    updatePasswordByUserID(objectValue) {
        return helper.sendQueryToDatabase(
            AccountScript.updatePasswordByUserID,
            [objectValue.Password, objectValue.UserAccountID]
        );
    };
    updateStatusOnline(objectValue) {
        return helper.sendQueryToDatabase(
            AccountScript.updateStatusOnline,
            [objectValue.StatusOnline, objectValue.UserAccountID]
        );
    };
    //Select info account for chat
    selectInfoAccountChat(UserAccountID) {
        return helper.sendQueryToDatabase(
            AccountScript.selectInfoAccountForChat,
            [UserAccountID]
        )
    };
};

module.exports = new AccountClass();