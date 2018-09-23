(function () {
    'use strict';

    const app = angular.module('app');

    // app.controller('workerController', ['$rootScope', 'func', workerController]);
    app.controller('workerDashboardController', ['$rootScope', 'func', workerDashboardController]);
    app.controller('cvPostController', ['$scope', '$log', 'call', 'api', 'func', cvPostController]);
    app.controller('cvNotActivatedByUseridController', ['$scope', '$log', 'call', 'api', 'func', cvNotActivatedByUseridController]);
    app.controller('cvActivatedByUseridController', ['$scope', '$log', 'call', 'api', 'func', cvActivatedByUseridController]);


    function workerDashboardController($rootScope, func) {
        if (func.getCookieAccessToken()) {
            $rootScope.info = func.setCookieAccount();
            func.checkParamOfUrl();
        } else {
            window.location.href = '/#!/tai-khoan/dang-nhap';
        }
    };

    function cvPostController($scope, $log, call, api, func) {
        $scope.iExprience = 0.5;

        $scope.optionsVariable = func.configTouchspin();

        $scope.loadListCategory = function () {
            try {
                call.GET(api.CATEGORY.GET_BY_USERWORKERID)
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

        $scope.submitCV = function () {
            try {
                let categoryData = {
                    CategoryID: $scope.selectedCategories.CategoryID,
                    Exprience: $scope.iExprience,
                    Qualifications: $scope.iQualifications,
                    GeneralInformation: $scope.iGeneralinformation,
                    ImageStore: "https://png.icons8.com/color/300/000000/small-business.png"
                };
                if (!categoryData.CategoryID || !categoryData.Exprience || !categoryData.Qualifications || !categoryData.GeneralInformation || !categoryData.ImageStore) {
                    throw "Thông tin không được để trống";
                }
                call.POST(api.CV.POST_CV, categoryData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess(`Đã đăng hồ sơ: ${$scope.selectedCategories.NameJobCategory}.`);
                        }
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        }
    };

    function cvNotActivatedByUseridController($scope, $log, call, api, func) {
        $scope.loadListCVNotActiveted = function () {
            try {
                call.GET(api.CV.NOT_ACTIVATED_BY_USERID)
                    .then(function (result) {
                        $scope.success = result.success;
                        $scope.myCV = result.result;
                        $scope.message = result.message;
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };

        $scope.clickDeleteCV = function (cv) {
            try {
                if (!cv.CategoryID) {
                    throw "Thông tin không được để trống";
                }
                let functionOfSweet = function () {
                    `${api.CV.NOT_ACTIVATED_BY_USERID}?categoryid=${cv.CategoryID}`
                    call.DELETE(`${api.CV.NOT_ACTIVATED_BY_USERID}?categoryid=${cv.CategoryID}`)
                        .then(function (result) {
                            if (result.success) {
                                swal.close();
                                func.showToastSuccess(`Bạn đã xóa hồ sơ: ${cv.NameJobCategory}.`);
                                $scope.loadListCVNotActiveted();
                            }
                        });
                };
                func.showSweetAlertDelete("Bạn có muốn xóa hồ sơ này?", null, functionOfSweet);
            } catch (err) {
                func.showToastError(err);
            }
        };

        $scope.clickEditCV = function (cv) {
            $scope.optionsVariable = func.configTouchspin();
            $scope.cv = cv;
        }

        $scope.submitEditCV = function () {
            try {
                let cvData = $scope.cv;
                if (!cvData.CategoryID || !cvData.Exprience || !cvData.Qualifications || !cvData.GeneralInformation || !cvData.ImageStore) {
                    throw "Thông tin không được để trống";
                }
                call.PUT(api.CV.NOT_ACTIVATED_BY_USERID, cvData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess(`Đã chỉnh sửa hồ sơ: ${$scope.cv.NameJobCategory}.`);
                            $('.modal').modal('toggle');
                        }
                    });
            } catch (err) {
                func.showToastError(err);
            }
        }
    };

    function cvActivatedByUseridController($scope, $log, call, api, func) {
        $scope.loadListCVActiveted = function () {
            try {
                call.GET(`${api.CV.ACTIVATED_BY_USERID}/${func.getCookieAccount().UserAccountID}`)
                    .then(function (result) {
                        $scope.success = result.success;
                        $scope.myCV = result.result;
                        $scope.message = result.message;
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };

        $scope.clickEditCV = function (cv) {
            $scope.optionsVariable = func.configTouchspin();
            $scope.cv = cv;
        }

        $scope.submitEditCV = function () {
            try {
                let cvData = $scope.cv;
                if (!cvData.CategoryID || !cvData.Exprience || !cvData.Qualifications || !cvData.GeneralInformation || !cvData.ImageStore) {
                    throw "Thông tin không được để trống";
                }
                call.PUT(api.CV.NOT_ACTIVATED_BY_USERID, cvData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess(`Đã chỉnh sửa hồ sơ: ${$scope.cv.NameJobCategory}.`);
                            $('.modal').modal('toggle');
                        }
                    });
            } catch (err) {
                func.showToastError(err);
            }
        }
    };

})();
