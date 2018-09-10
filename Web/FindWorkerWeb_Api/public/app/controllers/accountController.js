(function () {
    'use strict';

    const app = angular.module('app');

    app.controller('loginController', loginController);
    app.controller('signupController', signupController);

    loginController.$inject = ['$scope', 'call', 'func', 'api'];
    signupController.$inject = ['$scope', 'call'];

    function loginController($scope, call, func, api) {
        $scope.seed.SUBMIT_NAME = "Đăng nhập";
        $scope.LoginSubmit = function () {
            let userData = {
                username: $scope.UserName,
                password: $scope.PassWord,
                grant_type: "password"
            };
            call.POST(api.ACCOUNT.LOGIN.POST, userData)
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
                call.POST(api.ACCOUNT.SIGNUP.POST, userSignup)
                    .then(function (result) {
                        if (result.success) {
                            window.location.href = "/account/#!/tai-khoan/dang-nhap";
                        }
                    })
                    .catch(function (err){
                        func.showToast(err, 'danger', 'alert alert-danger text-center');
                    })
            } catch (err) {
                func.showToast(err, 'danger', 'alert alert-danger text-center');
            }
        }
    };
})();
