'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cotises = require('../../app/controllers/cotises.server.controller');

	// Cotises Routes
	app.route('/cotises')
		.get(cotises.list)
		.post(users.requiresLogin, cotises.create);

	app.route('/cotises/:cotiseId')
		.get(cotises.read)
		.put(users.requiresLogin, cotises.hasAuthorization, cotises.update)
		.delete(users.requiresLogin, cotises.hasAuthorization, cotises.delete);

	// Finish by binding the Cotise middleware
	app.param('cotiseId', cotises.cotiseByID);
};
