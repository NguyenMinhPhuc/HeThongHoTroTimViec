var db = require('../databases/createPool');
var curriculumVitaeScript = require('../databases/app_data/curriculumVitaeScript.json');

//POST
function postJobCategoryNotCategoryID(cv) {
    return new Promise((resolve, reject) => {
        db.connection.query(curriculumVitaeScript.postJobCategoryNotCategoryID, [cv], (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
};

module.exports = { postJobCategoryNotCategoryID };