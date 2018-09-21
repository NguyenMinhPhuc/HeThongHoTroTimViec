(function () {
	'use strict';

	angular
		.module('app')
		.factory('func', func);

	func.$inject = [
		// Angular modules 
		'$http', '$rootScope', '$log', '$timeout', '$location', '$cookies',
		// Custom modules

		// 3rd Party Modules
		'Flash'
	];

	function func($http, $rootScope, $log, $timeout, $location, $cookies, Flash) {
		var service = {
			configTouchspin: configTouchspin,
			getPathLocationArray: getPathLocationArray,
			checkParamOfUrl: checkParamOfUrl,
			storeCookie: storeCookie,
			getCookieAccount: getCookieAccount,
			setCookieAccount: setCookieAccount,
			checkCookie: checkCookie,
			clearCookie: clearCookie,
			showToastSuccess: showToastSuccess,
			showToast: showToast,
			showToastError: showToastError,
			showSweetAlertDelete: showSweetAlertDelete,
			goBackHistory: goBackHistory,
			getCookieAccessToken: getCookieAccessToken
		};

		var objConfigToastr = {
			"closeButton": true,
			"debug": false,
			"progressBar": true,
			"preventDuplicates": false,
			"positionClass": "toast-bottom-right",
			"onclick": null,
			"showDuration": "400",
			"hideDuration": "1000",
			"timeOut": "7000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		};

		return service;

		/*
		* Store cookie in browser
		*/
		function storeCookie(res) {
			var now = new Date();
			var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

			$cookies.put('access_token', res.token, { expires: exp });
			$cookies.putObject('account', {
				UserAccountID: res.UserAccountID,
				FullName: res.FullName,
				Image: res.Image,
				NameUserType: res.NameUserType,
				UserTypeID: res.UserTypeID
			}, { expires: exp });
		};

		/*
		* Check cookie in browser return true or false
		*/
		function checkCookie() {
			if ($cookies.get('access_token')) { return true; }
			return false;
		};


		/*
		* Get cookie in browser return true or false
		*/
		function getCookieAccessToken() {
			return $cookies.get('access_token');
		};

		/*
		* Get cookie in browser return true or false
		*/
		function setCookieAccount() {
			let account = getCookieAccount();
			return {
				Image: account.Image,
				FullName: account.FullName,
				NameUserType: account.NameUserType,
				UserTypeID: account.UserTypeID,
				UserAccountID: account.UserAccountID
			};
		};

		/*
		* Get cookie in browser return true or false
		*/
		function getCookieAccount() {
			return $cookies.getObject('account');
		};

		/*
		* Clear cookie in browser
		*/
		function clearCookie() {
			$cookies.remove('access_token');
			$cookies.remove('account');
		};

		/*
		* Check cookie in browser return true or false
		*/
		function checkParamOfUrl() {
			let firstParam = getPathLocationArray()[1];
			let userTypeID = getCookieAccount().UserTypeID;
			if (firstParam === "admin" && userTypeID === 2) {
				window.location.href = "/#!";
			} else if (firstParam !== "admin" && userTypeID === 1) {
				window.location.href = "/#!/admin";
			} else if ((firstParam === "admin" && userTypeID === 1) || (firstParam !== "admin" && userTypeID === 2)) {
				return;
			} else {
				clearCookie();
				$rootScope.info = "";
				window.location.href = "/#!/tai-khoan/dang-nhap";
			}
		};

		/**
		* define a object to config touchspin
		* @param {String} titleName Title content of Sweet
		* @param {String} textName Text content of Sweet
		* @param {Function} callbackFunction Callback Function in Sweet alert
		*/
		function configTouchspin() {
			return {
				min: 0,
				max: 70,
				step: 0.5,
				decimals: 1,
				buttonDownClass: 'btn btn-white',
				buttonUpClass: 'btn btn-white'
			}
		};

		/*
		* Get path of url
		*/
		function getPathLocationArray() {
			return $location.path().split("/");
		};

		function goBackHistory() {
			window.history.back();
		};

		//show notification
		/**
		 * Show toast when see errors or create/update/delete
		 * @param {any} msg Message of alert
		 * @param {any} typeName Type of alert ex: success, info, warning, danger
		 * @param {any} className Name Class of alert
		 */
		function showToast(msg, typeName, className) {
			Flash.create(typeName, msg, 5000, { class: className }, false);
		};

		/**
		* Show toast when see success a action
		* @param {any} contentName content of toast
		*/
		function showToastSuccess(contentName) {
			toastr.success(contentName, "Hoàn thành", objConfigToastr);
		};

		/**
		* Show toast when see have a error a action
		* @param {any} contentName content of toast
		*/
		function showToastError(contentName) {
			toastr.error(contentName, "Lỗi", objConfigToastr);
		};

		/**
		* Show Sweet when see have want delete something
		* @param {String} titleName Title content of Sweet
		* @param {String} textName Text content of Sweet
		* @param {Function} callbackFunction Callback Function in Sweet alert
		*/
		function showSweetAlertDelete(titleName, textName, callbackFunction) {
			swal({
				title: titleName,
				text: textName,
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Xóa!",
				cancelButtonText: "Hủy",
				closeOnConfirm: false
			}, callbackFunction);
		};
	}
})();