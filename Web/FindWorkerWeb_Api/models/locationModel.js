var locationScript = require('../databases/app_data/locationScript.json');
var helper = require('../helpers/helper');

//GET
function getAllProvince() {
    return helper.sendQueryToDatabase(
        locationScript.selectAllProvince,
        null
    );
};
function getAllDistrictByProvinceid(Provinceid) {
    return helper.sendQueryToDatabase(
        locationScript.selectAllDistrictByProvinceid,
        [Provinceid]
    );
};
function getAllWardByDistrictid(Districtid) {
    return helper.sendQueryToDatabase(
        locationScript.selectAllWardByDistrictid,
        [Districtid]
    );
};
//PUT
function putInfoGeolocationByUserID(locationData) {
    return helper.sendQueryToDatabase(
        locationScript.updateInfoGeolocation,
        [locationData.longitude, locationData.latitude, locationData.useraccountid]
    );
};

module.exports = { getAllProvince, getAllDistrictByProvinceid, getAllWardByDistrictid, putInfoGeolocationByUserID };