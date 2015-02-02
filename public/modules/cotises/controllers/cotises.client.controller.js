'use strict';

// Cotises controller
angular.module('cotises').controller('CotisesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cotises',
	function($scope, $stateParams, $location, Authentication, Cotises) {
		$scope.authentication = Authentication;

		// Create new Cotise
		$scope.create = function() {
			// Create new Cotise object
			var cotise = new Cotises ({
				name: this.name
			});

			// Redirect after save
			cotise.$save(function(response) {
				$location.path('cotises/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cotise
		$scope.remove = function(cotise) {
			if ( cotise ) { 
				cotise.$remove();

				for (var i in $scope.cotises) {
					if ($scope.cotises [i] === cotise) {
						$scope.cotises.splice(i, 1);
					}
				}
			} else {
				$scope.cotise.$remove(function() {
					$location.path('cotises');
				});
			}
		};

		// Update existing Cotise
		$scope.update = function() {
			var cotise = $scope.cotise;

			cotise.$update(function() {
				$location.path('cotises/' + cotise._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cotises
		$scope.find = function() {
			$scope.cotises = Cotises.query();
		};

		// Find existing Cotise
		$scope.findOne = function() {
			$scope.cotise = Cotises.get({ 
				cotiseId: $stateParams.cotiseId
			});
		};
	}
]);