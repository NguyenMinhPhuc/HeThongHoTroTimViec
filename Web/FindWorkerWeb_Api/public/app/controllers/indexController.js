(function () {
    'use strict';

    const app = angular.module('app');

    app.run(runInit);
    app.controller('indexController', indexController);

    runInit.$inject = ['$rootScope', 'func'];
    indexController.$inject = ['$scope', 'func'];

    function runInit($rootScope, func) {
        if (func.checkCookie()) {
            var account = func.getCookieAccount();
            $rootScope.info = {
                Image: account.Image,
                FullName: account.FullName,
                NameUserType: account.NameUserType,
                UserTypeID: account.UserTypeID
            }
            func.checkParamOfUrl();
        } else {
            window.location.href = '/#!/dang-nhap';
        }
    };

    function indexController($scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; };
        $scope.logout = function () {
            func.clearCookie();
            window.location.href = '/#!/dang-nhap';
        };
    };
})();
