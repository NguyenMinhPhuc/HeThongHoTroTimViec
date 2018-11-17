const DashboardScript = require('../databases/app_data/dashboard.json');
const helper = require('../helpers/helper');

class dashboardClass {
    selectCountCVByCategoryID() {
        return helper.sendQueryToDatabase(DashboardScript.selectCountCVByCategoryID, []);
    };
    selectCountTypeID() {
        return helper.sendQueryToDatabase(DashboardScript.selectCountTypeID, []);
    };
    selectCountTransaction() {
        return helper.sendQueryToDatabase(DashboardScript.selectCountTransaction, []);
    };
}

module.exports = new dashboardClass();