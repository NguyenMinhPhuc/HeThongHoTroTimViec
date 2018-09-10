var db = require('../databases/createPool');
var locationScript = require('../databases/app_data/locationScript.json');

//GET
function getAllProvince() {
    return new Promise((resolve, reject) => {
        db.connection.query(locationScript.selectAllProvince, (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
};
//POST
function postAllDistrictByProvinceid(Provinceid) {
    return new Promise((resolve, reject) => {
        db.connection.query(locationScript.selectAllDistrictByProvinceid, [Provinceid], (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
};
function postAllWardByDistrictid(Districtid) {
    return new Promise((resolve, reject) => {
        db.connection.query(locationScript.selectAllWardByDistrictid, [Districtid], (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
};
//PUT
function putInfoGeolocationByUserID(locationData) {
    return new Promise((resolve, reject) => {
        db.connection.query(locationScript.updateInfoGeolocation, [locationData.longitude, locationData.latitude, locationData.useraccountid], (err, results) => {
            if (err) { return reject(err); }
            return resolve(results);
        })
    });
};

module.exports = { getAllProvince, postAllDistrictByProvinceid, postAllWardByDistrictid, putInfoGeolocationByUserID };