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
    .put(cotises.update) //users.requiresLogin, cotises.hasAuthorization,
    .delete(users.requiresLogin, cotises.hasAuthorization, cotises.delete);

  //TODO
  app.route('/cotises/:cotiseId/contrib')
    .post(users.requiresLogin, cotises.addContrib);

  // Finish by binding the Cotise middleware
  app.param('cotiseId', cotises.cotiseByID);
};
