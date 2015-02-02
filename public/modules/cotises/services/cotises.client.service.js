'use strict';

//Cotises service used to communicate Cotises REST endpoints
angular.module('cotises').factory('Cotises', ['$resource',
	function($resource) {
		return $resource('cotises/:cotiseId', { cotiseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);