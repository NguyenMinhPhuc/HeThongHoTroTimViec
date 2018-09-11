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
                },
                "POST_CV": { "POST": localhost + "/api/cv/post" }
            },
            "CATAGORY": {
                "GET_ALL": { "GET": localhost + "/api/category/get-all" },
                "GET_BY_USERWORKERID": { "GET": localhost + "/api/category/get-by-userworkerid" }
            }
        };
        return service;
    }
})();