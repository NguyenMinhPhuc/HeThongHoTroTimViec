const CVScript = require('../databases/app_data/curriculumVitaeScript.json');
const helper = require('../helpers/helper');

class cvClass {
    //GET
    getJobCategoryByID(categoryid, namejobcategory) {
        return helper.sendQueryToDatabase(
            CVScript.selectJobCategoryByID,
            [categoryid, namejobcategory]
        );
    };
    getUserNotActivated(ActiveStatus, UserTypeID) {
        return helper.sendQueryToDatabase(
            CVScript.selectUserNotActivated,
            [ActiveStatus, UserTypeID]
        );
    };
    getUserActivated(UserWorkerID, ActiveStatus) {
        return helper.sendQueryToDatabase(
            CVScript.selectCVActivated,
            [UserWorkerID, ActiveStatus]
        );
    };
    selectCVByUserID(UserWorkerID) {
        return helper.sendQueryToDatabase(
            CVScript.selectCVByUserID,
            [UserWorkerID]
        );
    };
    getCVByCategoryID(CategoryID, ActiveStatus) {
        return helper.sendQueryToDatabase(
            CVScript.selectCVByCategoryID,
            [CategoryID, ActiveStatus]
        );
    };
    getCVByQuery(strQuery, UserTypeID, ActiveStatus) {
        return helper.sendQueryToDatabase(
            strQuery, [UserTypeID, ActiveStatus]
        );
    };
    //POST
    postJobCategoryByCategoryID(cv) {
        return helper.sendQueryToDatabase(
            CVScript.insertJobCategoryByCategoryID,
            [
                cv.CategoryID,
                cv.UserAccountID,
                cv.Exprience,
                cv.Qualifications,
                cv.GeneralInformation,
                cv.CategoryID,
                cv.UserAccountID
            ]
        );
    };
    //PUT
    putActiveCV(cvUpdateMD) {
        return helper.sendQueryToDatabase(
            CVScript.updateActiveCV,
            [cvUpdateMD.UserAccountID, cvUpdateMD.CategoryID, cvUpdateMD.UserWorkerID]
        );
    };
    putNotActivatedCV(cv) {
        return helper.sendQueryToDatabase(
            CVScript.updateNotActivatedCV,
            [
                cv.Exprience,
                cv.Qualifications,
                cv.GeneralInformation,
                cv.CategoryID,
                cv.UserAccountID
            ]
        );
    };
    //DELETE
    deleteCV(cvdelete) {
        return helper.sendQueryToDatabase(
            CVScript.deleteCV,
            [cvdelete.categoryid, cvdelete.userworkerid]
        );
    };
};

module.exports = new cvClass();