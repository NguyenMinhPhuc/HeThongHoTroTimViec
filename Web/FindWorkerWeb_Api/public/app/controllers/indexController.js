(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('indexController', indexController);

    indexController.$inject = ['$rootScope', '$scope', 'func'];

    function indexController($rootScope, $scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; };
        $scope.logout = function () {
            func.clearCookie();
            window.location.href = '/#!/tai-khoan/dang-nhap';
        };
        if (func.checkCookie()) {
            var account = func.getCookieAccount();
            $rootScope.info = {
                Image: account.Image,
                FullName: account.FullName,
                NameUserType: account.NameUserType,
                UserTypeID: account.UserTypeID,
                UserAccountID: account.UserAccountID
            };
        } else {
            func.clearCookie();
            window.location.href = '/#!/tai-khoan/dang-nhap';
        }
    };
})();
