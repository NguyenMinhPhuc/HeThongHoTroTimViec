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

function getJobCategoryByUserWorkerID(useraccount) {
    return helper.sendQueryToDatabase(
        CategoryScript.selectJobCategoryByUserWorkerID,
        [useraccount.useraccountid]
    );
};

module.exports = { getAllJobCategory, getJobCategoryByUserWorkerID };