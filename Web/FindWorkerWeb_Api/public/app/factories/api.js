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
                "SIGNUP": localhost + "/api/account/signup_for_worker",
                "VERIFY": localhost + "/api/account/verify"
            },
            "PROFILE": {
                "GET": localhost + "/api/account/profile",
                "UPDATE": localhost + "/api/account/profile"
            },
            "CV": {
                "NOT_ACTIVATED": localhost + "/api/cv/not-activated",
                "ACTIVE_CV": localhost + "/api/cv/active-cv",
                "ACTIVATED": localhost + "/api/cv/activated",
                "POST_CV": localhost + "/api/cv/post",
                "NOT_ACTIVATED_BY_USERID": localhost + "/api/cv/not-activated-by-userid",
                "ACTIVATED_BY_USERID": localhost + "/api/cv/activated",
                "ACTIVATED_BY_CATEGORYID": localhost + "/api/cv/activated-by-categoryid"
            },
            "CATAGORY": {
                "GET_ALL": localhost + "/api/category/get-all",
                "GET_BY_USERWORKERID": localhost + "/api/category/get-by-userworkerid"
            },
            "LOCATION": {
                "GET_ALL_PROVINCE": localhost + "/api/location/all-province",
                "GET_ALL_DISTRICT_BY_PROVINCEID": localhost + "/api/location/all-district-by-provinceid",
                "GET_ALL_WARD_BY_DISTRICTID": localhost + "/api/location/all-ward-by-districtid"
            }
        };
        return service;
    }
})();