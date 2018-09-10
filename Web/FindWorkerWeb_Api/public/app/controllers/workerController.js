(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('workerController', workerController);

    workerController.$inject = ['$scope', 'func'];

    function workerController($scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; }
    };
})();
