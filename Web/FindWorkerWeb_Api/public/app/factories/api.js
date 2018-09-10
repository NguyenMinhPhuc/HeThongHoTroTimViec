(function () {
    'use strict';

    angular
        .module('app')
        .factory('api', api);

    function api() {
        var localhost = "";
        var service = {
            "ACCOUNT": {
                "LOGIN": { "POST": localhost + "/api/account/login" },
                "SIGNUP": { "POST": localhost + "/api/account/signup_for_worker" }
            },
            "CV": {
                "NOT_ACTIVATED": { "GET": localhost + "/api/cv/not-activated" },
                "ACTIVE_CV": {
                    "PUT": localhost + "/api/cv/active-cv",
                    "DELETE": localhost + "/api/cv/active-cv"
                }
            }
        };
        return service;
    }
})();