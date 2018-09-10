(function () {
	'use strict';

	angular
		.module('app')
		.constant('seed', {
			LIST_LIMIT_NUMBERS: [
				{ id: 10, name: "10 records per page" },
				{ id: 10, name: "20 records per page" },
				{ id: 10, name: "30 records per page" },
				{ id: 10, name: "40 records per page" },
				{ id: 10, name: "50 records per page" }
			],
			GENDERS: [
				{ id: 0, name: "Female" },
				{ id: 1, name: "Male" },
				{ id: 2, name: "Other" }
			],
			CREATE_NAME: "Create",
			UPDATE_NAME: "Update",
			DELETE_NAME: "Delete"
		});

})();