(function () {
    'use strict';

    angular
        .module('app')
        .service('call', ['$http', '$cookies', '$log', '$q', function ($http, $cookies, $log, $q) {
            this.GET = function (controller) {
                $http.defaults.headers.common['Authorization'] = $cookies.get("access_token");
                return $http({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    url: controller
                }).then(function (result) {
                    return $q.resolve(result.data);
                }, err => {
                    $log.info(err);
                    let lbErr = "";
                    if (err.data.error == "invalid_grant") { lbErr = err.data.error_description }
                    else if (err.data.error["0"].msg) { lbErr = err.data.error["0"].msg }
                    else if (err.message) { lbErr = err.message }
                    else { lbErr = err }
                    return $q.reject(lbErr);
                });
            };

            this.POST = function (controller, data) {
                $http.defaults.headers.common['Authorization'] = $cookies.get("access_token");
                return $http({
                    method: 'POST',
                    url: controller,
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    data: data
                }).then(function (result) {
                    return $q.resolve(result.data);
                }).catch(function (err) {
                    $log.info(err);
                    let lbErr = "";
                    if (err.data.error == "invalid_grant") { lbErr = err.data.error_description }
                    else if (err.data.error["0"].msg) { lbErr = err.data.error["0"].msg }
                    else if (err.message) { lbErr = err.message }
                    else { lbErr = err }
                    return $q.reject(lbErr);
                });
            };

            this.PUT = function (controller, data) {
                $http.defaults.headers.common['Authorization'] = $cookies.get("access_token");
                data = JSON.stringify(data);
                return $http({
                    method: 'PUT',
                    url: controller,
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    data: data
                }).then(function (result) {
                    return $q.resolve(result.data);
                }, err => {
                    $log.info(err);
                    let lbErr = "";
                    if (err.data.error == "invalid_grant") { lbErr = err.data.error_description }
                    else if (err.data.error["0"].msg) { lbErr = err.data.error["0"].msg }
                    else if (err.message) { lbErr = err.message }
                    else { lbErr = err }
                    return $q.reject(lbErr);
                });
            };

            this.DELETE = function (controller, data) {
                $http.defaults.headers.common['Authorization'] = $cookies.get("access_token");
                $log.info(data);
                return $http({
                    method: 'DELETE',
                    url: controller,
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    data: data
                }).then(function (result) {
                    return $q.resolve(result.data);
                }, err => {
                    $log.info(err);
                    let lbErr = "";
                    if (err.data.error == "invalid_grant") { lbErr = err.data.error_description }
                    else if (err.data.error["0"].msg) { lbErr = err.data.error["0"].msg }
                    else if (err.message) { lbErr = err.message }
                    else { lbErr = err }
                    return $q.reject(lbErr);
                });
            };

        }]);
})();