/*jslint node: true */
'use strict';

module.exports = function (Users, http_server) {

	function process_login (req, res) {
		Users.find(req.body.username, req.body.password, function (err, users) {
			if (users.length) {
				req.session.regenerate(function () {
					req.session.user = req.body.username;
					req.session.is_logged = true;
					res.send({result: 'success', role: 2, username: req.session.user});
				});
			} else {
				req.session.error = "Login failed.  Try again.";
				res.send({result: 'failed'});
			}
		});
	}

	http_server.add_route({
		urls: ['/login'],
		methods: ['post'],
		controller: process_login,
		access: 'public'
	});

	function log_out (req, res) {
		req.session.destroy();
		res.send({logout: 'success'});
	}

	http_server.add_route({
		urls: ['/logout'],
		methods: ['post'],
		controller: log_out,
		access: 'public',
	});

	function check_status (req, res) {
		res.send({
			is_logged: !!req.session.is_logged,
			username: req.session.user
		});
	}

	http_server.add_route({
		urls: ['/check_status'],
		methods: ['post'],
		controller: check_status,
		access: 'public',
	});

	// function  (req, res){
	// 	let role = req.session.user ? 2 : 1;
	// 	let username = req.session.user ? req.session.user : '';
	//     res.cookie('user', JSON.stringify({
	//         'username': username,
	//         'role': role
	//     }));
	// 	res.sendfile('_build/html/main.html');
	// });

	// http_server.add_fallback_route({
	// 	urls: ['*'],
	// 	methods: ['get'],
	// 	controller: 
	// });
};
