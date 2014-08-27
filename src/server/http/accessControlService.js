/*jslint node: true */
'use strict';

let injector = require('../../injector');

let http = injector.module('http');

http.service('accessControl', {
	build (logger, Users, permission) {
		let routes = {
			get: {},
			post: {},
		};
		let access_levels = permission.access_levels,
			user_roles = permission.user_roles;

		return {
			secure_route (route) {
				logger.debug(`securing route ${route.url}.`);
				if (!('access_level' in route)) {
					route.access_level = access_levels.admin;
					logger.warn(`Missing access_level key in route ${route.url}. Set to admin.`);
				}
				if (typeof route.access_level === 'string') {
					route.access_level = access_levels[route.access_level];
				}
				if (route.entry_point) {
					add_credentials_to_controller(route);
				}

				routes[route.method][route.url] = route.access_level;
			},
			check_credentials(req, res, next) {
				if (is_authorized(req.url, req.method, req.session.role)) {
					next();
				} else {
					res.status(401);
					res.end('Unauthorized. Please log in.');
				}
			}
		};


		function add_credentials_to_controller (route) {
			let old_controller = route.controller;
			route.controller = function (req, res) {
				let role = req.session.role ? req.session.role : user_roles.public,
					username = req.session.user ? req.session.user : '',
					fullname = req.session.fullname ? req.session.fullname: '';
			    res.cookie('user', JSON.stringify({
			        'username': username,
			        'role': role,
			        'fullname': fullname,
			    }));
			    old_controller (req, res);
			};
		}

		function is_authorized(url, method, role = user_roles.public) {
			let access_level = routes[method.toLowerCase()][url];
			if (access_level === undefined) return false;
			return (access_level & role);
		} 
	}
});

