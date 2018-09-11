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

//POST
function postJobCategoryByCategoryID(cv) {
    return helper.sendQueryToDatabase(
        CVScript.insertJobCategoryByCategoryID,
        [
            cv.categoryid,
            cv.userworkerid,
            cv.exprience,
            cv.qualifications,
            cv.generalinformation,
            cv.imagestore,
            cv.categoryid,
            cv.userworkerid
        ]
    );
};

//PUT
function putActiveCV(cvUpdateMD) {
    return helper.sendQueryToDatabase(
        CVScript.updateActiveCV,
        [cvUpdateMD.useraccountid, cvUpdateMD.categoryid, cvUpdateMD.userworkerid]
    );
};

function putNotActivatedCV(cv) {
    // return new Promise((resolve, reject) => {
    //     db.connection.query(CVScript.updateNotActivatedCV, [cv.exprience, cv.qualifications, cv.generalinformation, cv.imagestore, cv.categoryid, cv.userworkerid], (err, results) => {
    //         if (err) { return reject(err); }
    //         resolve(results);
    //     });
    // });
    return helper.sendQueryToDatabase(
        CVScript.updateNotActivatedCV,
        [
            cv.exprience,
            cv.qualifications,
            cv.generalinformation,
            cv.imagestore,
            cv.categoryid,
            cv.userworkerid
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


module.exports = { getJobCategoryByID, getUserNotActivated, getUserActivated, postJobCategoryByCategoryID, putActiveCV, putNotActivatedCV, deleteCV };