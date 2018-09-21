(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('accountTemplateIndex', accountTemplateIndex);
    app.directive('adminTemplateIndex', adminTemplateIndex);
    app.directive('workerTemplateIndex', workerTemplateIndex);
    app.directive('datepicker', datepicker);
    app.directive('navbarMinimalize', navbarMinimalize);
    app.directive('metisMenu', metisMenu);

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

    function navbarMinimalize() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    $("body").toggleClass("mini-navbar");
                    SmoothlyMenu();
                });
            }
        };
    };

    function metisMenu() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $("body").metisMenu();
            }
        };
    };
})();