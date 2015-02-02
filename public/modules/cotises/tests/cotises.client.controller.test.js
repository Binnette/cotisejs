'use strict';

(function() {
	// Cotises Controller Spec
	describe('Cotises Controller Tests', function() {
		// Initialize global variables
		var CotisesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Cotises controller.
			CotisesController = $controller('CotisesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cotise object fetched from XHR', inject(function(Cotises) {
			// Create sample Cotise using the Cotises service
			var sampleCotise = new Cotises({
				name: 'New Cotise'
			});

			// Create a sample Cotises array that includes the new Cotise
			var sampleCotises = [sampleCotise];

			// Set GET response
			$httpBackend.expectGET('cotises').respond(sampleCotises);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cotises).toEqualData(sampleCotises);
		}));

		it('$scope.findOne() should create an array with one Cotise object fetched from XHR using a cotiseId URL parameter', inject(function(Cotises) {
			// Define a sample Cotise object
			var sampleCotise = new Cotises({
				name: 'New Cotise'
			});

			// Set the URL parameter
			$stateParams.cotiseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cotises\/([0-9a-fA-F]{24})$/).respond(sampleCotise);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cotise).toEqualData(sampleCotise);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cotises) {
			// Create a sample Cotise object
			var sampleCotisePostData = new Cotises({
				name: 'New Cotise'
			});

			// Create a sample Cotise response
			var sampleCotiseResponse = new Cotises({
				_id: '525cf20451979dea2c000001',
				name: 'New Cotise'
			});

			// Fixture mock form input values
			scope.name = 'New Cotise';

			// Set POST response
			$httpBackend.expectPOST('cotises', sampleCotisePostData).respond(sampleCotiseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cotise was created
			expect($location.path()).toBe('/cotises/' + sampleCotiseResponse._id);
		}));

		it('$scope.update() should update a valid Cotise', inject(function(Cotises) {
			// Define a sample Cotise put data
			var sampleCotisePutData = new Cotises({
				_id: '525cf20451979dea2c000001',
				name: 'New Cotise'
			});

			// Mock Cotise in scope
			scope.cotise = sampleCotisePutData;

			// Set PUT response
			$httpBackend.expectPUT(/cotises\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cotises/' + sampleCotisePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cotiseId and remove the Cotise from the scope', inject(function(Cotises) {
			// Create new Cotise object
			var sampleCotise = new Cotises({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cotises array and include the Cotise
			scope.cotises = [sampleCotise];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cotises\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCotise);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cotises.length).toBe(0);
		}));
	});
}());