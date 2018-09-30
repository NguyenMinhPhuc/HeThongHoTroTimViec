// var db = require('../databases/createPool');
var CategoryScript = require('../databases/app_data/categoryScript.json');
var helper = require('../helpers/helper');

//GET
function getAllJobCategory() {
    return helper.sendQueryToDatabase(
        CategoryScript.selectAllJobCategory,
        null
    );
};

function getJobCategoryByUserWorkerID(UserAccountID) {
    return helper.sendQueryToDatabase(
        CategoryScript.selectJobCategoryByUserWorkerID,
        [UserAccountID]
    );
};

function postJobCategory(valueObject) {
    return helper.sendQueryToDatabase(
        CategoryScript.insertJobCategory,
        [
            valueObject.NameJobCategory,
            valueObject.ImageStore,
            valueObject.NameJobCategory
        ]
    );
};

function putJobCategory(valueObject) {
    return helper.sendQueryToDatabase(
        CategoryScript.updateJobCategory,
        [
            valueObject.NameJobCategory,
            valueObject.ImageStore,
            valueObject.CategoryID
        ]
    );
};

module.exports = { getAllJobCategory, getJobCategoryByUserWorkerID, postJobCategory, putJobCategory };