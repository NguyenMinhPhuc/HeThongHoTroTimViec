var db = require('../databases/createPool');
var CategoryScript = require('../databases/app_data/categoryScript.json');

//GET
function getAllJobCategory() {
    return new Promise((resolve, reject) => {
        db.connection.query(CategoryScript.selectAllJobCategory, (err, results) => {
            if (err) { return reject(err); }
            resolve(results);
        });
    });
};

module.exports = { getAllJobCategory };