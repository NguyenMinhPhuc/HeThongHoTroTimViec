(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('workerDashboardController', ['$scope', 'func', workerDashboardController]);
    app.controller('cvPostController', ['$scope', '$log', 'call', 'api', 'func', cvPostController]);
    app.controller('cvNotActivatedByUseridController', ['$scope', '$log', 'call', 'api', 'func', cvNotActivatedByUseridController]);

    function workerDashboardController($scope, func) {
        $scope.pagename = function () { return func.getPathLocationArray()[1]; }
    };
    
    function cvPostController($scope, $log, call, api, func) {
        $scope.iExprience = 0.5;

        $scope.optionsVariable = func.configTouchspin();

        $scope.loadListCategory = function () {
            try {
                call.GET(api.CATAGORY.GET_BY_USERWORKERID)
                    .then(function (result) {
                        if (result.success) {
                            $scope.categories = result.result;
                        } else {
                            $scope.categories = [];
                        }
                    })
                    .catch(function (err) {
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
                call.POST(api.CV.POST_CV, categoryData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess(`Đã đăng hồ sơ: ${categoryData.namejobcategory}.`);
                        }
                    })
                    .catch(function (err) {
                        func.showToastError(err);
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
                    })
                    .catch(function (err) {
                        func.showToastError(err);
                    });
            } catch (err) {
                $log.error(err);
                func.showToastError(err);
            }
        };

        $scope.clickDeleteCV = function (categoryid, namejobcategory) {
            try {
                let cvData = {
                    categoryid: categoryid
                };

                if (!cvData.categoryid) {
                    throw "Thông tin không được để trống";
                }

                let functionOfSweet = function () {
                    call.DELETE(api.CV.NOT_ACTIVATED_BY_USERID, cvData)
                        .then(function (result) {
                            if (result.success) {
                                swal.close();
                                func.showToastSuccess(`Bạn đã xóa hồ sơ: ${namejobcategory}.`);
                                $scope.loadListCVNotActiveted();
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
                func.showToastError(err);
            }
        };

        $scope.clickEditCV = function (ImageStore, CategoryID, NameJobCategory, Exprience, Qualifications, GeneralInformation) {
            $scope.optionsVariable = func.configTouchspin();
            $scope.ImageStore = ImageStore;
            $scope.CategoryID = CategoryID;
            $scope.NameJobCategory = NameJobCategory;
            $scope.iExprience = Exprience;
            $scope.iQualifications = Qualifications;
            $scope.iGeneralInformation = GeneralInformation;
        }

        $scope.submitEditCV = function () {
            try {
                $log.info($scope.iExprience, $scope.iQualifications, $scope.iGeneralInformation, $scope.CategoryID);
                let cvData = {
                    categoryid: $scope.CategoryID,
                    exprience: $scope.iExprience,
                    qualifications: $scope.iQualifications,
                    generalinformation: $scope.iGeneralInformation,
                    imagestore: $scope.ImageStore
                };
                if (!cvData.categoryid || !cvData.exprience || !cvData.qualifications || !cvData.generalinformation || !cvData.imagestore) {
                    throw "Thông tin không được để trống";
                }
                call.PUT(api.CV.NOT_ACTIVATED_BY_USERID, cvData)
                    .then(function (result) {
                        if (result.success) {
                            func.showToastSuccess(`Đã chỉnh sửa hồ sơ: ${$scope.NameJobCategory}.`);
                            $('.modal').modal('toggle');
                            $scope.loadListCVNotActiveted();
                        }
                    })
                    .catch(function (err) {
                        $log.error(err);
                        func.showToastError(err);
                    });
            }catch (err) {
                func.showToastError(err);
            }
        }
    };

})();
