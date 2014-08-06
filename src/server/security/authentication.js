/*jslint node: true */
'use strict';

module.exports = function (logger, users, http_server) {

	function process_login (req, res) {
		users.find(req.body.username, req.body.password, function (err, users) {
			if (users.length) {
				req.session.regenerate(function () {
					req.session.user = req.body.username;
					req.session.is_logged = true;
					res.send({result: 'success', role: users[0].role, username: req.session.user});
				});
			} else {
				req.session.error = "Login failed.  Try again.";
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

