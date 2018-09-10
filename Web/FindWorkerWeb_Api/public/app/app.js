(function () {
	'use strict';

	angular.module('app', [
		// Angular modules 
		'ngRoute',

		// Custom modules

		// 3rd Party Modules
		'ngCookies', 'ngFlash'
	])
		.run([
			'$rootScope', 'seed', function ($rootScope, seed) {
				$rootScope.list = [];
				$rootScope.seed = seed;

				$rootScope.$on('$routeChangeStart', function () {
					// Something goes here ...
					$rootScope.list = [];
				});
			}])
		.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
			$routeProvider.when("/tai-khoan/dang-nhap", {
				controller: "loginController",
				templateUrl: "/module_views/account/login.html"
			});

			$routeProvider.when("/tai-khoan/dang-ky", {
				controller: "signupController",
				templateUrl: "/module_views/account/signup.html"
			});

			$routeProvider.when("/admin", {
				controller: "signupController",
				templateUrl: "/module_views/admin/dashboard.html"
			});

			$routeProvider.when("/", {
				controller: "signupController",
				templateUrl: "/module_views/worker/dashboard.html"
			});

			$routeProvider.when("/admin/ho-so/danh-sach-tho-doi-duyet", {
				controller: "listNotActivatedController",
				templateUrl: "/module_views/admin/cv/listNotActivated.html"
			});

			$routeProvider.otherwise({ redirectTo: "/tai-khoan/dang-nhap" });
		}]);

})();