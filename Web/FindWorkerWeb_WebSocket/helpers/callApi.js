const request = require('request');

const header = { 'Content-Type': 'application/json; charset=utf-8' };

class CallAPIClass {
    POST(controller, data, access_token) {
        return new Promise(function (resolve, reject) {
            data = JSON.stringify(data);
            header['Authorization'] = access_token;
            request({
                method: 'POST',
                headers: header,
                uri: controller,
                body: data
            }, function (err, response, body) {
                //console.log(`status: ${response.statusCode}, data: + ${body}`);
                // if (response.statusCode!=200) {
                //     reject(body);
                // } return;
            });
        });
    };
    PUT(controller, data, access_token) {
        data = JSON.stringify(data);
        header['Authorization'] = access_token;
        request({
            method: 'PUT',
            headers: header,
            uri: controller,
            body: data
        }, function (err, response, body) {
            //console.log(`status: ${response.statusCode}, data: + ${body}`);
            // if (response.statusCode!=200) {
            //     reject(body);
            // } return;
        });
    };
};

module.exports = new CallAPIClass();