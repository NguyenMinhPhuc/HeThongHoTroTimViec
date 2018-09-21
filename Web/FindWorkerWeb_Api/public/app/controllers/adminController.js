(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('adminDashboardController', ['$rootScope', 'func', adminDashboardController]);
    app.controller('listNotActivatedController', ['$scope', '$log', 'call', 'api', 'func', listNotActivatedController]);
    app.controller('categoriesWorkerController', ['$scope', '$log', 'call', 'api', 'func', categoriesWorkerController]);
    app.controller('classifyWorkersController', ['$q', '$scope', '$log', 'call', 'api', 'func', classifyWorkersController]);

    function adminDashboardController($rootScope, func) {
        if (func.getCookieAccessToken()) {
            $rootScope.info = func.setCookieAccount();
            func.checkParamOfUrl();
        } else {
            window.location.href = '/#!/tai-khoan/dang-nhap';
        }
    };

    function listNotActivatedController($scope, $log, call, api, func) {
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
                call.GET(api.CATEGORY.GET_ALL)
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
            loadListWorkerActivated($scope.selectedCategory);
        };

        function loadListWorkerActivated(CategoryID) {
            try {
                call.GET(`${api.CV.ACTIVATED_BY_QUERY}?categoryid=${CategoryID}`)
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

    function classifyWorkersController($q, $scope, $log, call, api, func) {
        //load data
        $scope.loadListCategory = function () {
            try {
                $q.all([
                    call.GET(api.CATEGORY.GET_ALL),
                    call.GET(api.LOCATION.GET_ALL_PROVINCE)
                ]).then(function (result) {
                    if (result[0].success) {
                        $scope.categories = result[0].result;
                        $scope.provinces = result[1].result;
                    } else {
                        $scope.categories = [];
                    }
                });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };
        $scope.loadDistrict = function () {
            loadAllDistrictByProvinceid($scope.selectedProvince);
            $scope.wards = "";
        };
        $scope.loadWard = function () { loadAllWardByDistrictid($scope.selectedDistrict); };
        $scope.changeCategory = function () {
            loadListWorkerActivated($scope.selectedCategory, $scope.selectedProvince, $scope.selectedDistrict, $scope.selectedWard);
        };
        $scope.loadWorkerWard = function () {
            loadListWorkerActivated($scope.selectedCategory, $scope.selectedProvince, $scope.selectedDistrict, $scope.selectedWard);
        }

        //FUNCTION
        function loadListWorkerActivated(CategoryID, ProvinceID, DistrictID, WardID) {
            try {
                call.GET(`${api.CV.ACTIVATED_BY_QUERY}?categoryid=${CategoryID}&provinceid=${ProvinceID}&districtid=${DistrictID}&wardid=${WardID}`)
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
        function loadAllDistrictByProvinceid(provinceid) {
            if (provinceid > 0) {
                loadListWorkerActivated($scope.selectedCategory, $scope.selectedProvince, $scope.selectedDistrict, $scope.selectedWard);
                call.GET(`${api.LOCATION.GET_ALL_DISTRICT_BY_PROVINCEID}?provinceid=${provinceid}`)
                    .then(function (resultDistrict) { $scope.districts = resultDistrict.result; });
            } else { $scope.districts = ""; }
        };
        function loadAllWardByDistrictid(districtid) {
            if (districtid > 0) {
                loadListWorkerActivated($scope.selectedCategory, $scope.selectedProvince, $scope.selectedDistrict, $scope.selectedWard);
                call.GET(`${api.LOCATION.GET_ALL_WARD_BY_DISTRICTID}?districtid=${districtid}`)
                    .then(function (resultWard) { $scope.wards = resultWard.result; });
            } else { $scope.wards = ""; }
        };
    };

})();
