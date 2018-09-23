var locationScript = require('../databases/app_data/locationScript.json');
var helper = require('../helpers/helper');

//GET
function getAllProvince() {
    return helper.sendQueryToDatabase(
        locationScript.selectAllProvince
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
function getProvinceByID(Provinceid) {
    return helper.sendQueryToDatabase(
        locationScript.selectProvinceByID,
        [Provinceid]
    );
};
function getDistrictByID(Districtid) {
    return helper.sendQueryToDatabase(
        locationScript.selectDistrictByID,
        [Districtid]
    );
};
function getWardByID(Wardid) {
    return helper.sendQueryToDatabase(
        locationScript.selectWardByID,
        [Wardid]
    );
};
//PUT
function putInfoGeolocationByUserID(locationData) {
    return helper.sendQueryToDatabase(
        locationScript.updateInfoGeolocation,
        [locationData.Longitude, locationData.Latitude, locationData.UserAccountID]
    );
};

module.exports = { getAllProvince, getAllDistrictByProvinceid, getAllWardByDistrictid, putInfoGeolocationByUserID, getProvinceByID, getDistrictByID, getWardByID };