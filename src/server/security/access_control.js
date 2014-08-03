/*jslint node: true */
'use strict';

module.exports = function (Users, roles, access_levels) {
	let routes = {};
	return {
		register_route (url, method, access_level) {

		},
		check_access_rights(req, res, next) {
			next();
		}
	};
};
