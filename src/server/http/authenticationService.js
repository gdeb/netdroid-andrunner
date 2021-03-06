/*jslint node: true */
'use strict';

let app = require('../../moebius');

let http = app.module('http');

http.service('authentication', {
	build (logger, Users, server) {
		authentication(logger, Users, server);
	}
});

function authentication (logger, users, http_server) {

	function process_login (req, res) {
		users.find(req.body.username, req.body.password, function (err, users) {
			if (users.length) {
				logger.info(`User ${req.body.username} successfully logged in`);
				req.session.regenerate(function () {
					req.session.user = req.body.username;
					req.session.fullname = users[0].fullname;
					req.session.is_logged = true;
					req.session.role = users[0].role;
					res.send({
						result: 'success', 
						role: users[0].role, 
						username: req.session.user,
						fullname: users[0].fullname,
					});
				});
			} else {
				logger.info(`Unsuccessful login attempt (${req.body.username})`);
				res.send({result: 'failed'});
			}
		});
	}

	http_server.add_route({
		url: '/login',
		method: 'post',
		controller: process_login,
		access_level: 'anon'
	});

	function log_out (req, res) {
		logger.info(`User ${req.session.user} logged out`);
		req.session.destroy();
		res.send({logout: 'success'});
	}

	http_server.add_route({
		url: '/logout',
		method: 'post',
		controller: log_out,
		access_level: 'user',
	});
};

