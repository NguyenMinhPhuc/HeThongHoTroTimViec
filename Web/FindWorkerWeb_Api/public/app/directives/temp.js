(function () {
    'use strict';

    angular
        .module('app')
        .directive('accountTemplateIndex', accountTemplateIndex)
        .directive('adminTemplateIndex', adminTemplateIndex)
        .directive('workerTemplateIndex', workerTemplateIndex);

    function accountTemplateIndex() {
        return {
            restrict: 'E',
            templateUrl: '/layout/index/account.html',
        };
    }

    function adminTemplateIndex() {
        return {
            restrict: 'E',
            templateUrl: '/layout/index/admin.html',
        };
    }

    function workerTemplateIndex() {
        return {
            restrict: 'E',
            templateUrl: '/layout/index/worker.html',
        };
    }
})();