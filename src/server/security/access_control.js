/*jslint node: true */
'use strict';

module.exports = function (logger, users, config) {
	let routes = {};
	return {
		secure_route (route) {
		},
		check_credentials(req, res, next) {
			next();
		}
	};
};
