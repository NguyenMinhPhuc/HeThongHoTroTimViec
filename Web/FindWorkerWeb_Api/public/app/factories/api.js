(function () {
    'use strict';

    angular
        .module('app')
        .factory('api', api);

    function api() {
        var localhost = "";
        var service = {
            "ACCOUNT": {
                "LOGIN": localhost + "/api/account/login",
                "SIGNUP": localhost + "/api/account/signup_for_worker"
            },
            "CV": {
                "NOT_ACTIVATED": localhost + "/api/cv/not-activated",
                "ACTIVE_CV": localhost + "/api/cv/active-cv",
                "POST_CV": localhost + "/api/cv/post",
                "NOT_ACTIVATED_BY_USERID": localhost + "/api/cv/not-activated-by-userid"
            },
            "CATAGORY": {
                "GET_ALL": localhost + "/api/category/get-all",
                "GET_BY_USERWORKERID": localhost + "/api/category/get-by-userworkerid"
            }
        };
        return service;
    }
})();