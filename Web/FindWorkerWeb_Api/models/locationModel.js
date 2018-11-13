const locationScript = require('../databases/app_data/locationScript.json');
const helper = require('../helpers/helper');

//GET
class locationClass {
    getAllProvince() {
        return helper.sendQueryToDatabase(
            locationScript.selectAllProvince
        );
    };
    getAllDistrictByProvinceid(Provinceid) {
        return helper.sendQueryToDatabase(
            locationScript.selectAllDistrictByProvinceid,
            [Provinceid]
        );
    };
    getAllWardByDistrictid(Districtid) {
        return helper.sendQueryToDatabase(
            locationScript.selectAllWardByDistrictid,
            [Districtid]
        );
    };
    getProvinceByID(Provinceid) {
        return helper.sendQueryToDatabase(
            locationScript.selectProvinceByID,
            [Provinceid]
        );
    };
    getDistrictByID(Districtid) {
        return helper.sendQueryToDatabase(
            locationScript.selectDistrictByID,
            [Districtid]
        );
    };
    getWardByID(Wardid) {
        return helper.sendQueryToDatabase(
            locationScript.selectWardByID,
            [Wardid]
        );
    };
    //PUT
    putInfoGeolocationByUserID(locationData) {
        return helper.sendQueryToDatabase(
            locationScript.updateInfoGeolocation,
            [locationData.Longitude, locationData.Latitude, locationData.UserAccountID]
        );
    };
};

module.exports = new locationClass();