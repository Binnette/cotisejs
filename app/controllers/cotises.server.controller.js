'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cotise = mongoose.model('Cotise'),
	_ = require('lodash');

/**
 * Create a Cotise
 */
exports.create = function(req, res) {
	var cotise = new Cotise(req.body);
	cotise.user = req.user;

	cotise.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cotise);
		}
	});
};

/**
 * Show the current Cotise
 */
exports.read = function(req, res) {
	res.jsonp(req.cotise);
};

/**
 * Update a Cotise
 */
exports.update = function(req, res) {
	var cotise = req.cotise ;

	cotise = _.extend(cotise , req.body);

	cotise.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cotise);
		}
	});
};

/**
 * Delete an Cotise
 */
exports.delete = function(req, res) {
	var cotise = req.cotise ;

	cotise.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cotise);
		}
	});
};

/**
 * List of Cotises
 */
exports.list = function(req, res) { 
	Cotise.find().sort('-created').populate('user', 'displayName').exec(function(err, cotises) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cotises);
		}
	});
};

/**
 * Cotise middleware
 */
exports.cotiseByID = function(req, res, next, id) { 
	Cotise.findById(id).populate('user', 'displayName').exec(function(err, cotise) {
		if (err) return next(err);
		if (! cotise) return next(new Error('Failed to load Cotise ' + id));
		req.cotise = cotise ;
		next();
	});
};

/**
 * Cotise authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cotise.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
