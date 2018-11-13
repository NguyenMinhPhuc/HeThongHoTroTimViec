const statisticalScript = require("../databases/app_data/statisticalScript.json");
const helper = require('../helpers/helper');

class statisticalClass {
    selectAllWorker(limit, offset) {
        return helper.sendQueryToDatabase(
            statisticalScript.selectAllWorker, [offset, limit]
        );
    };
    selectAllGuest(limit, offset) {
        return helper.sendQueryToDatabase(
            statisticalScript.selectAllGuest, [offset, limit]
        );
    };
    selectAllTransactionDone(limit, offset) {
        return helper.sendQueryToDatabase(
            statisticalScript.selectAllTransactionDone, [offset, limit]
        );
    };
};

module.exports = new statisticalClass();