'use strict';

// Cotises controller
angular.module('cotises').controller('CotisesController', ['$scope', '$log', '$stateParams', '$location', 'Authentication', 'Cotises',
  function($scope, $log, $stateParams, $location, Authentication, Cotises) {
    $scope.$log = $log;
    $scope.authentication = Authentication;

    // Create new Cotise
    $scope.create = function() {
      // Create new Cotise object
      var cotise = new Cotises ({
        title: this.title,
        description: this.description
      });

      // Redirect after save
      cotise.$save(function(response) {
        $location.path('cotises/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
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

    // Add contributions
    $scope.addContrib = function(){
      //$log.log('addContrib');
      var cotise = $scope.cotise;
      /*
      var newContrib = {
          amount: cotise.newContributionAmount,
          cotise: cotise
      };*/

      /*cotise.$addContrib(function() {
          // Clear form fields
          $scope.newContributionAmount = 0;
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });*/

      //check inputs

      // search for previous contribution
      var i, index = 0, found = false;
      var size = cotise.contributions ? cotise.contributions.length : 0;
      for (i = 0; i < size && !found; i++) {
        if (cotise.contributions[i].username === cotise.newContributionUsername) {
          found = true;
          index = i;
        }
      }
      // contribution not found, add a new contribution
      if (found) {
        cotise.contributions.splice(index, 1);
      }

      if (cotise.newContributionAmount > 0) {
        cotise.contributions.push({
          amount: cotise.newContributionAmount,
          username: cotise.newContributionUsername
        });
      }

      /*cotise.contributions.sort(function(a, b) {
        return a.s > b.s;
      });*/

      cotise.$update(function(){
        // Clear form fields
        $scope.newContributionAmount = 0;
        $scope.newContributionUsername = 0;
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