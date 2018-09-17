(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('loginController', ['$scope', 'call', 'func', 'api', loginController]);
    app.controller('signupController', ['$scope', 'call', signupController]);
    app.controller('verifyController', ['$scope', '$routeParams', 'call', 'api', verifyController]);

    var objValue = {};

    function loginController($scope, call, func, api) {
        func.clearCookie();
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
                        if (result.success) {
                            $scope.message = result.message;
                        }
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
    }
})();
