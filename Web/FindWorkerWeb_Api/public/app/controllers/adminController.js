(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('adminDashboardController', ['$scope', 'func', adminDashboardController]);
    app.controller('listNotActivatedController', ['$scope', '$log', 'call', 'api', 'func', listNotActivatedController]);

    function adminDashboardController($scope, func) {

    };

    function listNotActivatedController($scope, $log, call, api, func) {
        //load data
        $scope.loadListWorkerNotActivated = function () {
            try {
                call.GET(api.CV.NOT_ACTIVATED.GET)
                    .then(function (result) {
                        if (result.success) {
                            $scope.userCategories = result.result;
                            $log.info($scope.userCategories);
                        }
                    })
                    .catch(function (err) {
                        $log.error(err);
                        func.showToastError(err);
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };

        $scope.clickAgreeCV = function (categoryid, userworkerid, namejobcategory, fullname) {
            try {
                let cvData = {
                    categoryid: categoryid,
                    userworkerid: userworkerid
                };

                if (!cvData.categoryid || !cvData.userworkerid) {
                    throw "Thông tin không được để trống";
                }

                call.PUT(api.CV.ACTIVE_CV.PUT, cvData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess("Bạn đã duyệt hồ sơ: " + namejobcategory + "." + "<br>Của thợ: " + fullname + ".");
                            $scope.loadListWorkerNotActivated();
                        }
                    })
                    .catch(function (err) {
                        $log.error(err);
                        func.showToastError(err);
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };

        $scope.clickDeleteCV = function (categoryid, userworkerid, namejobcategory, fullname) {
            try {
                let cvData = {
                    categoryid: categoryid,
                    userworkerid: userworkerid
                };

                if (!cvData.categoryid || !cvData.userworkerid) {
                    throw "Thông tin không được để trống";
                }

                let functionOfSweet = function () {
                    call.DELETE(api.CV.ACTIVE_CV.DELETE, cvData)
                        .then(function (result) {
                            if (result.success) {
                                swal.close();
                                func.showToastSuccess("Bạn đã xóa hồ sơ: " + namejobcategory + "." + "<br>Của thợ: " + fullname + ".");
                                $scope.loadListWorkerNotActivated();
                            }
                        })
                        .catch(function (err) {
                            $log.error(err);
                            swal.close();
                            func.showToastError(err);
                        });
                };

                func.showSweetAlertDelete("Bạn có muốn xóa hồ sơ này?", null, functionOfSweet);
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };
    };
})();
