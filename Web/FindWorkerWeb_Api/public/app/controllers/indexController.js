(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('indexController', indexController);
    
    indexController.$inject = ['$scope', 'func'];

    function indexController($scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; };
        $scope.logout = function () {
            func.clearCookie();
            window.location.href = '/#!/dang-nhap';
        };
    };
})();
