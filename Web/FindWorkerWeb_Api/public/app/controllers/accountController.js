(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('loginController', ['$scope', 'call', 'func', 'api', loginController]);
    app.controller('signupController', ['$scope', 'call', signupController]);
    app.controller('verifyController', ['$scope', '$routeParams', 'call', 'api', verifyController]);
    app.controller('profileController', ['$q', '$scope', '$routeParams', 'call', 'func', 'api', profileController]);
    app.controller('changeProfileController', ['$q', '$rootScope', '$scope', 'call', 'func', 'api', changeProfileController]);

    var objValue = {};

    function loginController($scope, call, func, api) {
        // func.clearCookie();
        $scope.seed.SUBMIT_NAME = "Đăng nhập";
        $scope.LoginSubmit = function () {
            try {
                let userData = {
                    username: $scope.UserName,
                    password: $scope.PassWord,
                    grant_type: "password"
                };
                call.POSTACCOUNT(api.ACCOUNT.LOGIN, userData)
                    .then(function (result) {
                        if (result.UserTypeID == 1) {
                            func.storeCookie(result);
                            window.location.href = "/#!/admin";
                        } else if (result.UserTypeID == 2) {
                            func.storeCookie(result);
                            window.location.href = "/#!";
                        } else {
                            throw "Loại tài khoản của bạn không có quyền đăng nhập tại đây.";
                        }
                    })
                    .catch(function (err) {
                        func.showToast(err, 'danger', 'alert alert-danger text-center');
                    });
            } catch (err) {
                func.showToast(err, 'danger', 'alert alert-danger text-center');
            }
        };
    };

    function signupController($scope, call) {
        $scope.signupSubmit = function () {
            let userSignup = {
                username: $scope.UserName,
                password: $scope.Password,
                email: $scope.Email,
                fullname: $scope.Fullname
            };
            try {
                if (userSignup.password != $scope.Password2) {
                    throw "Mật khẩu phải giống nhau";
                }
                if (!userSignup.username || !userSignup.password || !userSignup.email || !userSignup.fullname) {
                    throw "Không được để trống";
                }
                call.POSTACCOUNT(api.ACCOUNT.SIGNUP, userSignup)
                    .then(function (result) {
                        if (result.success) {
                            window.location.href = "/account/#!/tai-khoan/dang-nhap";
                        }
                    })
                    .catch(function (err) {
                        func.showToast(err, 'danger', 'alert alert-danger text-center');
                    })
            } catch (err) {
                func.showToast(err, 'danger', 'alert alert-danger text-center');
            }
        }
    };

    function verifyController($scope, $routeParams, call, api) {
        try {
            $scope.message = "Đợi xác thực tài khoản.";
            objValue = {
                email: $routeParams.email,
                codeactive: $routeParams.code
            };
            if (objValue.email || objValue.codeactive) {
                call.PUTACCOUNT(api.ACCOUNT.VERIFY, objValue)
                    .then(function (result) {
                        $scope.message = result.message;
                    })
                    .catch(function (err) {
                        $scope.message = err.error_description;
                    });
            } else {
                throw "Email và code không rỗng";
            }
        } catch (err) {
            $scope.message = err;
        }
    };

    function profileController($q, $scope, $routeParams, call, func, api) {
        $scope.loadProfile = function () {
            try {
                if ($routeParams.profileid > 100000000) {
                    $q.all([
                        call.GET(`${api.PROFILE.GET}/${$routeParams.profileid}`),
                        call.GET(`${api.CV.ACTIVATED}/${$routeParams.profileid}`)])
                        .then(function (result) {
                            $scope.myProfile = result[0];
                            $scope.cvSuccess = result[1].success;
                            $scope.myCV = result[1].result;
                            $scope.cvMessage = result[1].message;
                        });
                } else {
                    throw "Đường dẫn bị sai";
                }
            } catch (err) {
                func.showToastError(err);
            }
        }
    };

    function changeProfileController($q, $rootScope, $scope, call, func, api) {
        $scope.loadProfile = function () {
            try {
                $q.all([
                    call.GET(`${api.PROFILE.GET}/${func.getCookieAccount().UserAccountID}`),
                    call.GET(api.LOCATION.GET_ALL_PROVINCE)
                ]).then(function (result) {
                    $scope.myProfile = result[0];
                    $scope.provinces = result[1].result;
                    loadAllDistrictByProvinceid(result[0].ProvinceID);
                    loadAllWardByDistrictid(result[0].DistrictID);
                    if ($scope.myProfile.ProvinceID > 0 && $scope.myProfile.DistrictID > 99 && $scope.myProfile.WardID > 9999) {
                        $scope.selectedProvince = $scope.myProfile.ProvinceID + "";
                        $scope.selectedDistrict = $scope.myProfile.DistrictID + "";
                        $scope.selectedWard = $scope.myProfile.WardID + "";
                    }
                });
            } catch (err) { func.showToastError(err); }
        };
        $scope.loadDistrict = function () {
            loadAllDistrictByProvinceid($scope.selectedProvince);
            $scope.wards = "";
        };
        $scope.loadWard = function () { loadAllWardByDistrictid($scope.selectedDistrict); };
        $scope.submitProfile = function () {
            try {
                $scope.myProfile.ProvinceID = $scope.selectedProvince;
                $scope.myProfile.DistrictID = $scope.selectedDistrict;
                $scope.myProfile.WardID = $scope.selectedWard;
                if ($scope.myProfile.ProvinceID === undefined) { throw "Phải chọn Tỉnh hoặc Thành Phố." }
                if ($scope.myProfile.DistrictID === undefined) { throw "Phải chọn tên Thành Phố, Quận, Huyện." }
                if ($scope.myProfile.WardID === undefined) { throw "Phải chọn tên Phường Xã." }
                call.PUT(api.PROFILE.UPDATE, $scope.myProfile)
                    .then(function (result) {
                        func.showToastSuccess(result.message);
                        window.location.href = `/#!/p/${$rootScope.info.UserAccountID}`;
                    });
            } catch (err) { func.showToastError(err); }
        };
        $scope.clickCheckbox = function () { $scope.myProfile.IsMale = !$scope.myProfile.IsMale; };
        $scope.goBackHistory = function () { func.goBackHistory(); };

        //Function
        function loadAllDistrictByProvinceid(provinceid) {
            if (provinceid > 0) {
                call.GET(`${api.LOCATION.GET_ALL_DISTRICT_BY_PROVINCEID}?provinceid=${provinceid}`)
                    .then(function (resultDistrict) { $scope.districts = resultDistrict.result; });
            } else { $scope.districts = ""; }
        };
        function loadAllWardByDistrictid(districtid) {
            if (districtid > 99) {
                call.GET(`${api.LOCATION.GET_ALL_WARD_BY_DISTRICTID}?districtid=${districtid}`)
                    .then(function (resultWard) { $scope.wards = resultWard.result; });
            } else { $scope.wards = ""; }
        };
    };
})();
