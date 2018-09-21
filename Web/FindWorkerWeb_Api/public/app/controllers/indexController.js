(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('indexController', indexController);
    app.controller('homeController', homeController);

    indexController.$inject = ['$scope', 'func'];
    homeController.$inject = ['$rootScope', '$scope', 'func'];

    function indexController($scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; };
    };

    function homeController($rootScope, $scope, func) {
        $scope.logout = function () {
            func.clearCookie();
            $rootScope.info = {};
            window.location.href = '/#!/tai-khoan/dang-nhap';
        };
        if (func.getCookieAccessToken()) {
            $rootScope.info = func.setCookieAccount();
        } else {
            window.location.href = '/#!/tai-khoan/dang-nhap';
        }
    };
})();
