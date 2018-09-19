(function () {
	'use strict';

	angular.module('app', [
		// Angular modules 
		'ngRoute',

		// Custom modules

		// 3rd Party Modules
		'ngCookies', 'ngFlash', 'nk.touchspin'
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

			//ALL
			$routeProvider.when("/p/:profileid", {
				controller: "profileController",
				templateUrl: "/module_views/profile/profile.html"
			});

			$routeProvider.when("/trang-ca-nhan/chinh-sua", {
				controller: "changeProfileController",
				templateUrl: "/module_views/profile/changeProfile.html"
			});

			//account
			$routeProvider.when("/tai-khoan/dang-nhap", {
				controller: "loginController",
				templateUrl: "/module_views/account/login.html"
			});

			$routeProvider.when("/tai-khoan/dang-ky", {
				controller: "signupController",
				templateUrl: "/module_views/account/signup.html"
			});
			
			$routeProvider.when("/tai-khoan/verify", {
				controller: "verifyController",
				templateUrl: "/module_views/account/verify.html"
			});

			//admin
			$routeProvider.when("/admin", {
				controller: "adminDashboardController",
				templateUrl: "/module_views/admin/dashboard.html"
			});
			
			$routeProvider.when("/admin/ho-so/danh-muc-tho", {
				controller: "categoriesWorkerController",
				templateUrl: "/module_views/admin/cv/categoriesWorker.html"
			});

			$routeProvider.when("/admin/ho-so/danh-sach-tho-doi-duyet", {
				controller: "listNotActivatedController",
				templateUrl: "/module_views/admin/cv/listNotActivated.html"
			});

			//worker
			$routeProvider.when("/", {
				controller: "workerDashboardController",
				templateUrl: "/module_views/worker/dashboard.html"
			});

			$routeProvider.when("/ho-so/dang-ho-so", {
				controller: "cvPostController",
				templateUrl: "/module_views/worker/cv/cvPost.html"
			});

			$routeProvider.when("/ho-so/danh-sach-ho-so-doi-duyet", {
				controller: "cvNotActivatedByUseridController",
				templateUrl: "/module_views/worker/cv/cvNotActivatedByUserid.html"
			});

			$routeProvider.when("/ho-so/danh-sach-da-duyet", {
				controller: "cvActivatedByUseridController",
				templateUrl: "/module_views/worker/cv/cvActivatedByUserid.html"
			});

			$routeProvider.otherwise({ 
				redirectTo: "/tai-khoan/dang-nhap" 
				// templateUrl: "/module_views/error404.html"
			});
		}]);

})();