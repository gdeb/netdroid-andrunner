/*jslint node: true */
'use strict';
let users_db = require('../schemas/users.js'),
	logger = require('../framework/logger.js');

//-----------------------------------------------------------------------------
function login (req, res, options) {
	res.render('login', options);
}

module.exports.login = {
	urls: ['/login'],
	methods: ['get'],
	controller: login,
	access: 'public'
};

//-----------------------------------------------------------------------------
function process_login (req, res) {
	users_db.find(req.body.username, req.body.password, function (err, users) {
		if (users.length) {
			req.session.regenerate(function () {
				req.session.user = req.body.username;
				res.redirect('lobby');
			});
		} else {
			req.session.error = "Login failed.  Try again.";
			res.redirect('login');
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
function logout (req, res) {
	req.session.regenerate(function () {
		req.session.info = "You have been successfully logged out";
		res.redirect('/');
	});
}

module.exports.logout = {
	urls: ['/logout'],
	methods: ['get'],
	controller: logout,
};

