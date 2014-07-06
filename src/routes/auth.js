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

//-----------------------------------------------------------------------------
function profile (req, res, options) {
	res.render('profile', options);
}

module.exports.profile = {
	urls: ['/profile'],
	methods: ['get'],
	script: 'profile.js',
	controller: profile,
};

//-----------------------------------------------------------------------------
function change_password (req, res) {
	let user = req.session.user,
		old_pw = req.body.old_password,
		new_pw = req.body.new_password;

	users_db.update_password(user, old_pw, new_pw, function (err, success) {
		if (err) {
			req.session.error = "Wrong password.  Try again.";
			res.redirect('/profile');			
		} else {
			req.session.success = "Success.  Your password has been changed.";
			res.redirect('/profile');			
		}
	});
}

module.exports.change_password = {
	urls: ['/change_password'],
	methods: ['post'],
	controller: change_password,
};
