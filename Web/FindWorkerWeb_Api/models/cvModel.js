var CVScript = require('../databases/app_data/curriculumVitaeScript.json');
var helper = require('../helpers/helper');

//GET
function getJobCategoryByID(categoryid, namejobcategory) {
    return helper.sendQueryToDatabase(
        CVScript.selectJobCategoryByID,
        [categoryid, namejobcategory]
    );
};
function getUserNotActivated(ActiveStatus, UserTypeID) {
    return helper.sendQueryToDatabase(
        CVScript.selectUserNotActivated,
        [ActiveStatus, UserTypeID]
    );
};
function getUserActivated(UserWorkerID, ActiveStatus) {
    return helper.sendQueryToDatabase(
        CVScript.selectCVActivated,
        [UserWorkerID, ActiveStatus]
    );
};
function getCVByCategoryID(CategoryID, ActiveStatus) {
    return helper.sendQueryToDatabase(
        CVScript.selectCVByCategoryID,
        [CategoryID, ActiveStatus]
    );
};
function getCVByQuery(strQuery, UserTypeID, ActiveStatus) {
    return helper.sendQueryToDatabase(
        strQuery, [UserTypeID, ActiveStatus]
    );
};

//POST
function postJobCategoryByCategoryID(cv) {
    return helper.sendQueryToDatabase(
        CVScript.insertJobCategoryByCategoryID,
        [
            cv.CategoryID,
            cv.UserAccountID,
            cv.Exprience,
            cv.Qualifications,
            cv.GeneralInformation,
            cv.ImageStore,
            cv.CategoryID,
            cv.UserAccountID
        ]
    );
};

//PUT
function putActiveCV(cvUpdateMD) {
    return helper.sendQueryToDatabase(
        CVScript.updateActiveCV,
        [cvUpdateMD.UserAccountID, cvUpdateMD.CategoryID, cvUpdateMD.UserWorkerID]
    );
};

function putNotActivatedCV(cv) {
    return helper.sendQueryToDatabase(
        CVScript.updateNotActivatedCV,
        [
            cv.Exprience,
            cv.Qualifications,
            cv.GeneralInformation,
            cv.ImageStore,
            cv.CategoryID,
            cv.UserAccountID
        ]
    );
};

//DELETE
function deleteCV(cvdelete) {
    return helper.sendQueryToDatabase(
        CVScript.deleteCV,
        [cvdelete.categoryid, cvdelete.userworkerid]
    );
};


module.exports = { getCVByQuery, getJobCategoryByID, getUserNotActivated, getUserActivated, getCVByCategoryID, postJobCategoryByCategoryID, putActiveCV, putNotActivatedCV, deleteCV };