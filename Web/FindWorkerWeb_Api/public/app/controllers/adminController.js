(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('adminDashboardController', ['$rootScope', 'func', adminDashboardController]);
    app.controller('listNotActivatedController', ['$scope', '$log', 'call', 'api', 'func', listNotActivatedController]);
    app.controller('categoriesWorkerController', ['$scope', '$log', 'call', 'api', 'func', categoriesWorkerController]);

    function adminDashboardController($rootScope, func) {
        if (func.checkCookie()) {
            var account = func.getCookieAccount();
            $rootScope.info = {
                Image: account.Image,
                FullName: account.FullName,
                NameUserType: account.NameUserType,
                UserTypeID: account.UserTypeID,
                UserAccountID: account.UserAccountID
            }
            func.checkParamOfUrl();
        } else {
            window.location.href = '/#!/tai-khoan/dang-nhap';
        }
    };

    function listNotActivatedController($scope, $log, call, api, func) {
        //load data
        $scope.loadListWorkerNotActivated = function () {
            try {
                call.GET(api.CV.NOT_ACTIVATED)
                    .then(function (result) {
                        $scope.success = result.success;
                        $scope.userCategories = result.result;
                        $scope.message = result.message;
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

                call.PUT(api.CV.ACTIVE_CV, cvData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess("Bạn đã duyệt hồ sơ: " + namejobcategory + "." + "<br>Của thợ: " + fullname + ".");
                            $scope.loadListWorkerNotActivated();
                        }
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
                    call.DELETE(api.CV.ACTIVE_CV, cvData)
                        .then(function (result) {
                            if (result.success) {
                                swal.close();
                                func.showToastSuccess("Bạn đã xóa hồ sơ: " + namejobcategory + "." + "<br>Của thợ: " + fullname + ".");
                                $scope.loadListWorkerNotActivated();
                            }
                        });
                };

                func.showSweetAlertDelete("Bạn có muốn xóa hồ sơ này?", null, functionOfSweet);
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };
    };

    function categoriesWorkerController($scope, $log, call, api, func) {
        //load data
        $scope.loadListCategory = function () {
            try {
                call.GET(api.CATAGORY.GET_ALL)
                    .then(function (result) {
                        if (result.success) {
                            $scope.categories = result.result;
                        } else {
                            $scope.categories = [];
                        }
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };

        $scope.changeCategory = function () {
            $scope.loadListWorkerActivated($scope.selectedCategory.CategoryID);
        };

        $scope.loadListWorkerActivated = function (CategoryID) {
            try {
                call.GET(`${api.CV.ACTIVATED_BY_CATEGORYID}?categoryid=${CategoryID}`)
                    .then(function (result) {
                        $scope.success = result.success;
                        $scope.userCategories = result.result;
                        $scope.message = result.message;
                    })
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };
    };
})();
