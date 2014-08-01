/*jslint node: true */
'use strict';
let users_db = require('../schemas/users.js'),
	logger = require('../logger.js');

//-----------------------------------------------------------------------------
function process_login (req, res) {
	users_db.find(req.body.username, req.body.password, function (err, users) {
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

module.exports.process_login = {
	urls: ['/login'],
	methods: ['post'],
	controller: process_login,
	access: 'public'
};

//-----------------------------------------------------------------------------
function log_out (req, res) {
	req.session.destroy();
	res.send({logout: 'success'});
}

module.exports.log_out = {
	urls: ['/logout'],
	methods: ['post'],
	controller: log_out,
	access: 'public',
};

//-----------------------------------------------------------------------------
function check_status (req, res) {
	res.send({
		is_logged: !!req.session.is_logged,
		username: req.session.user
	});
}

module.exports.check_status = {
	urls: ['/check_status'],
	methods: ['post'],
	controller: check_status,
	access: 'public',
};