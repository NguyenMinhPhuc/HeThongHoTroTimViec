var db = require('../databases/createPool');
var CVScript = require('../databases/app_data/curriculumVitaeScript.json');

//GET
function getJobCategoryID(categoryid, namejobcategory) {
    return new Promise((resolve, reject) => {
        db.connection.query(CVScript.selectJobCategoryID, [categoryid, namejobcategory], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};
function getUserNotActivated(ActiveStatus, UserTypeID) {
    return new Promise((resolve, reject) => {
        db.connection.query(CVScript.selectUserNotActivated, [ActiveStatus, UserTypeID], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    })
};

//POST
function postJobCategoryNotByCategoryID(cv) {
    return new Promise((resolve, reject) => {
        db.connection.query(CVScript.insertJobCategoryNotByCategoryID, [cv.userworkerid, cv.namejobcategory, cv.exprience, cv.qualifications, cv.generalinformation, cv.imagestore], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};
function postJobCategoryByCategoryID(cv) {
    return new Promise((resolve, reject) => {
        db.connection.query(CVScript.insertJobCategoryByCategoryID, [cv.categoryid, cv.userworkerid, cv.namejobcategory, cv.exprience, cv.qualifications, cv.generalinformation, cv.imagestore, cv.categoryid, cv.userworkerid], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};

//PUT
function putActiveCV(cvUpdateMD) {
    return new Promise((resolve, reject) => {
        db.connection.query(CVScript.updateActiveCV, [cvUpdateMD.useraccountid, cvUpdateMD.categoryid, cvUpdateMD.userworkerid], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};

//DELETE
function deleteCV(cvdelete) {
    return new Promise((resolve, reject) => {
        db.connection.query(CVScript.deleteCV, [cvdelete.categoryid, cvdelete.userworkerid], (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};


module.exports = { getUserNotActivated, getJobCategoryID, postJobCategoryNotByCategoryID, postJobCategoryByCategoryID, putActiveCV, deleteCV };