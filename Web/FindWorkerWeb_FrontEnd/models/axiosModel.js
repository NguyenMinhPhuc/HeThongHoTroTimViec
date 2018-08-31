var axios = require("axios");
var qs = require("qs");

//HTTP METHOD GET
async function getAxios(token, namePath) {
    let urlTemp = process.env.FWF_URLBACKEND.concat(namePath);
    let config = {
        headers: {
            'authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };
    return await axios.get(urlTemp, config);

};

//HTTP METHOD POST
async function postAxios(token, valueObject, namePath) {
    let urlTemp = process.env.FWF_URLBACKEND.concat(namePath);
    let data = qs.stringify(valueObject);
    let config = {
        headers: {
            'authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };
    return await axios.post(urlTemp, data, config);
};

//HTTP METHOD PUT
async function putAxios(token, valueObject, namePath) {
    let urlTemp = process.env.FWF_URLBACKEND.concat(namePath);
    let data = qs.stringify(valueObject);
    let config = {
        headers: {
            'authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };
    return await axios.put(urlTemp, data, config);
};
//HTTP METHOD DELETE
async function deleteAxios(token, valueObject, namePath) {
    let urlTemp = process.env.FWF_URLBACKEND.concat(namePath);
    let config = {
        data: qs.stringify(valueObject),
        headers: {
            'authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };
    return await axios.delete(urlTemp, config);
};

module.exports = { getAxios, postAxios, putAxios, deleteAxios };