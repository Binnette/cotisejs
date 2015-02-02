'use strict';

//Setting up route
angular.module('cotises').config(['$stateProvider',
	function($stateProvider) {
		// Cotises state routing
		$stateProvider.
		state('listCotises', {
			url: '/cotises',
			templateUrl: 'modules/cotises/views/list-cotises.client.view.html'
		}).
		state('createCotise', {
			url: '/cotises/create',
			templateUrl: 'modules/cotises/views/create-cotise.client.view.html'
		}).
		state('viewCotise', {
			url: '/cotises/:cotiseId',
			templateUrl: 'modules/cotises/views/view-cotise.client.view.html'
		}).
		state('editCotise', {
			url: '/cotises/:cotiseId/edit',
			templateUrl: 'modules/cotises/views/edit-cotise.client.view.html'
		});
	}
]);