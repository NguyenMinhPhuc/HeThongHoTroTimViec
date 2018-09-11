(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('workerDashboardController', ['$scope', 'func', workerDashboardController]);
    app.controller('cvPostController', ['$scope', '$log', 'call', 'api', 'func', cvPostController]);

    function workerDashboardController($scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; }
    };

    function cvPostController($scope, $log, call, api, func) {
        $scope.iExprience = 0.5;

        $scope.optionsVariable = func.configTouchspin();

        $scope.loadListCategory = function () {
            try {
                call.GET(api.CATAGORY.GET_BY_USERWORKERID.GET)
                    .then(function (result) {
                        if (result.success) {
                            $scope.categories = result.result;
                            $log.info($scope.categories);
                        }else{
                            $scope.categories = [];
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
        $scope.submitCV = function () {
            try {
                let categoryData = {
                    categoryid: $scope.selectedCategories.CategoryID,
                    namejobcategory: $scope.selectedCategories.NameJobCategory,
                    exprience: $scope.iExprience,
                    qualifications: $scope.iQualifications,
                    generalinformation: $scope.iGeneralinformation,
                    imagestore: "https://png.icons8.com/color/300/000000/small-business.png"
                };
                if (!categoryData.categoryid || !categoryData.namejobcategory || !categoryData.exprience || !categoryData.qualifications || !categoryData.generalinformation || !categoryData.imagestore) {
                    throw "Thông tin không được để trống";
                }
                call.POST(api.CV.POST_CV.POST, categoryData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess(`Đã đăng hồ sơ: ${categoryData.namejobcategory}.`);
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
        }
    };
})();
