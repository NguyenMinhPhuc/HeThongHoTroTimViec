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
            window.location.href = '/#!/tai-khoan/dang-nhap';
        };
        if (func.getCookieAccessToken()) {
            let account = func.getCookieAccount();
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
