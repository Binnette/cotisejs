'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cotise = mongoose.model('Cotise'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cotise;

/**
 * Cotise routes tests
 */
describe('Cotise CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Cotise
		user.save(function() {
			cotise = {
				name: 'Cotise Name'
			};

			done();
		});
	});

	it('should be able to save Cotise instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cotise
				agent.post('/cotises')
					.send(cotise)
					.expect(200)
					.end(function(cotiseSaveErr, cotiseSaveRes) {
						// Handle Cotise save error
						if (cotiseSaveErr) done(cotiseSaveErr);

						// Get a list of Cotises
						agent.get('/cotises')
							.end(function(cotisesGetErr, cotisesGetRes) {
								// Handle Cotise save error
								if (cotisesGetErr) done(cotisesGetErr);

								// Get Cotises list
								var cotises = cotisesGetRes.body;

								// Set assertions
								(cotises[0].user._id).should.equal(userId);
								(cotises[0].name).should.match('Cotise Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cotise instance if not logged in', function(done) {
		agent.post('/cotises')
			.send(cotise)
			.expect(401)
			.end(function(cotiseSaveErr, cotiseSaveRes) {
				// Call the assertion callback
				done(cotiseSaveErr);
			});
	});

	it('should not be able to save Cotise instance if no name is provided', function(done) {
		// Invalidate name field
		cotise.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cotise
				agent.post('/cotises')
					.send(cotise)
					.expect(400)
					.end(function(cotiseSaveErr, cotiseSaveRes) {
						// Set message assertion
						(cotiseSaveRes.body.message).should.match('Please fill Cotise name');
						
						// Handle Cotise save error
						done(cotiseSaveErr);
					});
			});
	});

	it('should be able to update Cotise instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cotise
				agent.post('/cotises')
					.send(cotise)
					.expect(200)
					.end(function(cotiseSaveErr, cotiseSaveRes) {
						// Handle Cotise save error
						if (cotiseSaveErr) done(cotiseSaveErr);

						// Update Cotise name
						cotise.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cotise
						agent.put('/cotises/' + cotiseSaveRes.body._id)
							.send(cotise)
							.expect(200)
							.end(function(cotiseUpdateErr, cotiseUpdateRes) {
								// Handle Cotise update error
								if (cotiseUpdateErr) done(cotiseUpdateErr);

								// Set assertions
								(cotiseUpdateRes.body._id).should.equal(cotiseSaveRes.body._id);
								(cotiseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cotises if not signed in', function(done) {
		// Create new Cotise model instance
		var cotiseObj = new Cotise(cotise);

		// Save the Cotise
		cotiseObj.save(function() {
			// Request Cotises
			request(app).get('/cotises')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cotise if not signed in', function(done) {
		// Create new Cotise model instance
		var cotiseObj = new Cotise(cotise);

		// Save the Cotise
		cotiseObj.save(function() {
			request(app).get('/cotises/' + cotiseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cotise.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cotise instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cotise
				agent.post('/cotises')
					.send(cotise)
					.expect(200)
					.end(function(cotiseSaveErr, cotiseSaveRes) {
						// Handle Cotise save error
						if (cotiseSaveErr) done(cotiseSaveErr);

						// Delete existing Cotise
						agent.delete('/cotises/' + cotiseSaveRes.body._id)
							.send(cotise)
							.expect(200)
							.end(function(cotiseDeleteErr, cotiseDeleteRes) {
								// Handle Cotise error error
								if (cotiseDeleteErr) done(cotiseDeleteErr);

								// Set assertions
								(cotiseDeleteRes.body._id).should.equal(cotiseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cotise instance if not signed in', function(done) {
		// Set Cotise user 
		cotise.user = user;

		// Create new Cotise model instance
		var cotiseObj = new Cotise(cotise);

		// Save the Cotise
		cotiseObj.save(function() {
			// Try deleting Cotise
			request(app).delete('/cotises/' + cotiseObj._id)
			.expect(401)
			.end(function(cotiseDeleteErr, cotiseDeleteRes) {
				// Set message assertion
				(cotiseDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cotise error error
				done(cotiseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Cotise.remove().exec();
		done();
	});
});