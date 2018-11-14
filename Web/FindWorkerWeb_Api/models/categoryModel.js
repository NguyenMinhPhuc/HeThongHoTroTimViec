const CategoryScript = require('../databases/app_data/categoryScript.json');
const helper = require('../helpers/helper');

class categoryClass {
    //GET
    getAllJobCategory() {
        return helper.sendQueryToDatabase(
            CategoryScript.selectAllJobCategory,
            null
        );
    };
    getJobCategoryByUserWorkerID(UserAccountID) {
        return helper.sendQueryToDatabase(
            CategoryScript.selectJobCategoryByUserWorkerID,
            [UserAccountID]
        );
    };
    postJobCategory(valueObject) {
        return helper.sendQueryToDatabase(
            CategoryScript.insertJobCategory,
            [
                valueObject.NameJobCategory,
                valueObject.ImageStore,
                valueObject.NameJobCategory
            ]
        );
    };
    selectInfoCVByCategoryID(CategoryID) {
        return helper.sendQueryToDatabase(CategoryScript.selectInfoCVByCategoryID, [CategoryID]);
    };
    putJobCategory(valueObject) {
        return helper.sendQueryToDatabase(
            CategoryScript.updateJobCategory,
            [
                valueObject.NameJobCategory,
                valueObject.ImageStore,
                valueObject.CategoryID
            ]
        );
    };
}
module.exports = new categoryClass();