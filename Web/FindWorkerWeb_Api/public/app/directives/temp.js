(function () {
    'use strict';

    angular
        .module('app')
        .directive('accountTemplateIndex', accountTemplateIndex)
        .directive('adminTemplateIndex', adminTemplateIndex)
        .directive('workerTemplateIndex', workerTemplateIndex)
        .directive('datepicker', datepicker);

    function accountTemplateIndex() {
        return {
            restrict: 'E',
            templateUrl: '/layout/index/account.html',
        };
    };

    function adminTemplateIndex() {
        return {
            restrict: 'E',
            templateUrl: '/layout/index/admin.html',
        };
    };

    function workerTemplateIndex() {
        return {
            restrict: 'E',
            templateUrl: '/layout/index/worker.html',
        };
    };

    function datepicker() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.datepicker({
                    language: 'vi',
                    todayBtn: "linked",
                    keyboardNavigation: false,
                    forceParse: false,
                    autoclose: true,
                    startView: 2,
                    zIndexOffset: 1000,
                    format: 'dd/mm/yyyy'
                });
            }
        };
    };
})();