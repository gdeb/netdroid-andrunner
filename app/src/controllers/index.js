/*jslint node: true */
'use strict';

let logger = require('../logger'),
	http = require('http'),
	Datastore = require('nedb'),
	users_db = new Datastore({filename:'_build/db/users.db', autoload:true}),
	request = require('request');

//-----------------------------------------------------------------------------
module.exports.main = function (req, res) {
	render_view(req, res, 'index');
};

module.exports.login = function (req, res) {
	render_view(req, res, 'login');
};

module.exports.process_login = function (req, res) {
	users_db.find({
		username: req.body.username, 
		password: req.body.password
	}, function (err, users) {
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
};

module.exports.lobby = function (req, res) {
	render_view(req, res, 'lobby');
};

module.exports.profile = function (req, res) {
	render_view(req, res, 'profile');
};

module.exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/');
};

module.exports.change_password = function (req, res) {
	let user_info = {
		username: req.session.user,
		password: req.body.old_password
	};
	users_db.find(user_info, function (err, users) {
		if (users.length) {
			users_db.update(user_info, {$set: {
				password: req.body.new_password
			}}, function (err) {
				req.session.success = "Success.  Your password has been changed.";
				res.redirect('/profile');
			});
		} else {
			req.session.error = "Wrong password.  Try again.";
			res.redirect('/profile');
		}
	});
};

module.exports.get_card = function (req, res, ...args) {
	let image_url = 'http://netrunnerdb.com/web/bundles/netrunnerdbcards/images/cards/en-large/01' + 
		req.params.id + '.png';
	req.pipe(request(image_url)).pipe(res);
};

//-----------------------------------------------------------------------------
function render_view(req, res, view) {
	res.render(view, {
		error: req.session.error,
		info: req.session.info,
		success: req.session.success,
		user: req.session.user,
		script: req.matched_route.script,
		partials: {
			header: 'header',
			navbar: 'navbar',
			footer: 'footer',
		},
	});
	delete req.session.error;
	delete req.session.success;	
}
